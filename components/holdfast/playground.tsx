"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage, type MessageLink } from "@/components/holdfast/chat-message";
import { DealEmbed } from "@/components/holdfast/deal-embed";
import { UnderTheHood } from "@/components/holdfast/under-the-hood";
import { ACTION_LABEL, STATE_LABEL, narrate } from "@/lib/holdfast-copy";
import {
  CLOSED,
  HOLDFAST_REPO,
  type Deal,
  type DealAction,
  type Health,
  HoldfastError,
  type Session,
  holdfast,
  isAddress,
  loadSession,
  saveSession,
  short,
} from "@/lib/holdfast";

const POLL_MS = 3_000;
const AMOUNTS = ["5", "10", "25"];
const DEFAULT_DESCRIPTION = "A logo design";
// what the waiting line says while a slow request runs, a step every few seconds
const SELLER_WAIT = [
  "Creating the deal",
  "The demo bot is minting the payment on Sepolia",
  "Waiting for the block (usually 12 to 30 seconds)",
];
const PAY_WAIT = ["Minting test dollars to the deposit address", "Waiting for the block (usually 12 to 30 seconds)"];
const SEND_WAIT = ["Sending the money from the deal's address", "Waiting for the block (usually 12 to 30 seconds)"];

type Item =
  | { id: number; at: Date; kind: "bot"; text: string; tone?: "error" | "success"; links?: MessageLink[] }
  | { id: number; at: Date; kind: "you"; text: string }
  | { id: number; at: Date; kind: "deal" }
  | { id: number; at: Date; kind: "timeline" };

type Panel = "payout" | "refund_address" | "dispute" | "respond" | null;
/** An item before it has an id and a time (Omit over each kind of item, not the union as a whole). */
type NewItem = Item extends infer I ? (I extends Item ? Omit<I, "id" | "at"> & { at?: Date } : never) : never;

const GREETING =
  "Hi, I'm Holdfast, an escrow bot. Pick a side and an amount, and I'll run a real trade on the Sepolia test network, with the demo bot as the other party.";

/** Links for the moments that have them: a payment seen, money sent. */
function linksFor(deal: Deal): MessageLink[] {
  if (["confirming", "funded", "partially_paid"].includes(deal.state)) {
    return deal.payments.map((p, i) => ({ label: `Payment${deal.payments.length > 1 ? ` ${i + 1}` : ""} on Etherscan`, url: p.tx.url }));
  }
  if (deal.state === "released" || deal.state === "refunded") {
    return deal.settlements.map((s, i) => ({ label: `Transfer${deal.settlements.length > 1 ? ` ${i + 1}` : ""} on Etherscan`, url: s.url }));
  }
  return [];
}

export function Playground() {
  const [health, setHealth] = useState<Health | "checking" | "offline">("checking");
  const [session, setSession] = useState<Session | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [amount, setAmount] = useState(AMOUNTS[0]);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [field, setField] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const nextId = useRef(0);
  const dealRef = useRef<Deal | null>(null);
  const linked = useRef<Set<string>>(new Set()); // each transaction is linked once, where it's first mentioned
  const scroller = useRef<HTMLDivElement>(null);

  const say = useCallback((item: NewItem) => {
    setItems((list) => [...list, { ...item, id: nextId.current++, at: item.at ?? new Date() } as Item]);
  }, []);

  /** Take a fresh copy of the deal; if its state moved, Holdfast says what that means. */
  const take = useCallback(
    (next: Deal) => {
      const before = dealRef.current;
      dealRef.current = next;
      setDeal(next);
      if (!before || before.state !== next.state) {
        const links = linksFor(next).filter((l) => !linked.current.has(l.url));
        links.forEach((l) => linked.current.add(l.url));
        say({ kind: "bot", text: narrate(next), links, tone: CLOSED.includes(next.state) ? "success" : undefined });
        if (CLOSED.includes(next.state)) say({ kind: "timeline" });
      }
    },
    [say],
  );

  // on load (once, even when React runs effects twice in development): is the demo up, and is there a
  // trade to pick back up?
  const booted = useRef(false);
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    holdfast
      .health()
      .then(setHealth)
      .catch(() => setHealth("offline"));
    say({ kind: "bot", text: GREETING });
    const saved = loadSession();
    if (saved) {
      holdfast
        .deal(saved.id, saved.token)
        .then((d) => {
          setSession(saved);
          say({ kind: "bot", text: "Welcome back. Here's the trade you had going." });
          say({ kind: "deal" });
          take(d);
        })
        .catch(() => saveSession(null));
    }
  }, [say, take]);

  // while a trade is open, follow it: the watcher on the server moves it as the chain does
  useEffect(() => {
    if (!session || !deal || CLOSED.includes(deal.state)) return;
    const timer = setInterval(() => {
      holdfast
        .deal(session.id, session.token)
        .then(take)
        .catch(() => {
          // a missed poll is fine: the next one catches up
        });
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [session, deal, take]);

  // the deadline countdown ticks once a minute
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // keep the newest message in view
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [items, busy]);

  /** Run a slow call with a waiting line that steps through `lines`, and report a refusal in the chat. */
  async function waiting<T>(lines: string[], run: () => Promise<T>): Promise<T | null> {
    let i = 0;
    setBusy(lines[0]);
    const timer = setInterval(() => {
      i = Math.min(i + 1, lines.length - 1);
      setBusy(lines[i]);
    }, 5_000);
    try {
      return await run();
    } catch (error) {
      const message = error instanceof HoldfastError ? error.message : "Something went wrong";
      say({ kind: "bot", tone: "error", text: message });
      return null;
    } finally {
      clearInterval(timer);
      setBusy(null);
    }
  }

  async function start() {
    const text = description.trim() || DEFAULT_DESCRIPTION;
    say({ kind: "you", text: `I'm the ${role}: ${amount} tUSD for "${text}".` });
    const created = await waiting(role === "seller" ? SELLER_WAIT : ["Creating the deal"], () =>
      holdfast.start(role, amount, text),
    );
    if (!created) return;
    const next = { id: created.deal.id, token: created.token };
    saveSession(next);
    setSession(next);
    say({ kind: "deal" });
    take(created.deal);
  }

  async function pay() {
    if (!session || !deal) return;
    say({ kind: "you", text: `Pay ${deal.amount.text}` });
    const paid = await waiting(PAY_WAIT, () => holdfast.pay(session.id, session.token));
    if (!paid) return;
    linked.current.add(paid.tx.url);
    say({ kind: "bot", text: "Sent. Now I wait for the network to confirm it.", links: [{ label: "The payment on Etherscan", url: paid.tx.url }] });
    take(paid.deal);
  }

  async function act(action: "confirm" | "deliver" | "cancel" | "refund", said: string) {
    if (!session) return;
    say({ kind: "you", text: said });
    const lines = action === "deliver" ? ["The demo bot is checking the delivery", ...SEND_WAIT] : SEND_WAIT;
    const next = await waiting(lines, () => holdfast.act(session.id, session.token, action));
    if (next) take(next);
  }

  async function submitPanel() {
    if (!session || !panel) return;
    const value = field.trim();
    if ((panel === "payout" || panel === "refund_address") && !isAddress(value)) {
      say({ kind: "bot", tone: "error", text: "That isn't an Ethereum address: it starts with 0x and has 40 more letters and digits." });
      return;
    }
    if (panel === "dispute" && !value) return;
    const labels = { payout: "Pay me at", refund_address: "Refund me at", dispute: "Dispute:", respond: "My answer:" };
    const shown = panel === "payout" || panel === "refund_address" ? short(value) : value || "(no note)";
    say({ kind: "you", text: `${labels[panel]} ${shown}` });
    setPanel(null);
    setField("");
    const run = {
      payout: () => holdfast.payoutAddress(session.id, session.token, value),
      refund_address: () => holdfast.refundAddress(session.id, session.token, value),
      dispute: () => holdfast.dispute(session.id, session.token, value),
      respond: () => holdfast.respond(session.id, session.token, value),
    }[panel];
    const next = await waiting(panel === "payout" || panel === "refund_address" ? SEND_WAIT : ["Saving"], run);
    if (next) {
      if (panel === "payout" || panel === "refund_address") say({ kind: "bot", text: "Got it. That's where the money goes." });
      take(next);
    }
  }

  function startOver() {
    saveSession(null);
    setSession(null);
    dealRef.current = null;
    linked.current = new Set();
    setDeal(null);
    setPanel(null);
    setItems([]);
    say({ kind: "bot", text: GREETING });
  }

  const actions = new Set<DealAction>(deal?.actions ?? []);
  const closed = deal ? CLOSED.includes(deal.state) : false;
  const offline = health === "offline";
  const sellerNeedsAddress = deal?.you === "seller" && !deal.payout_address && actions.has("payout_address");
  const buyerNeedsRefundAddress =
    deal?.you === "buyer" && !deal.refund_address && actions.has("refund_address") && ["refund_pending", "disputed"].includes(deal.state);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <section className="hf-channel overflow-hidden rounded-2xl border border-line" aria-label="Holdfast escrow demo">
        <header className="hf-channel-head flex items-center gap-2.5 border-b border-line px-4 py-3">
          <span className="text-[19px] leading-none text-faint" aria-hidden="true">
            #
          </span>
          <h2 className="text-[15px] font-semibold">escrow-demo</h2>
          <span className="hidden text-[13px] text-faint sm:inline">a trade on the Sepolia test network</span>
          <span className="ml-auto flex items-center gap-2 text-[12px] text-muted">
            <span className={`hf-live ${offline ? "down" : health === "checking" ? "" : "up"}`} aria-hidden="true" />
            {offline ? "Offline" : health === "checking" ? "Connecting" : `Sepolia · block ${health.head.toLocaleString()}`}
          </span>
        </header>

        <div ref={scroller} className="hf-scroll overflow-y-auto pb-4">
          {offline ? (
            <div className="px-6 py-14 text-center">
              <p className="text-[16px] font-medium">The demo server is taking a break</p>
              <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-muted">
It runs on a small server of mine and should be back soon. Meanwhile, the code and a narrated example trade are
                in{" "}
                <a href={HOLDFAST_REPO} target="_blank" rel="noreferrer" className="hf-link">
                  the repository
                </a>
                .
              </p>
            </div>
          ) : (
            <ol aria-live="polite" aria-relevant="additions">
              {items.map((item, i) => {
                const prev = items[i - 1];
                const sameSender =
                  prev &&
                  prev.kind !== "you" &&
                  item.kind !== "you" &&
                  item.at.getTime() - prev.at.getTime() < 60_000 &&
                  !(item.kind === "bot" && item.tone === "error");
                if (item.kind === "deal") {
                  return deal ? (
                    <li key={item.id} className="px-4 pt-1">
                      <div className="sm:pl-12">
                        <DealEmbed deal={deal} now={now} />
                      </div>
                    </li>
                  ) : null;
                }
                if (item.kind === "timeline") {
                  return deal ? (
                    <li key={item.id} className="px-4 pt-2">
                      <div className="sm:pl-12">
                        <ol className="hf-timeline max-w-[520px] rounded-md px-4 py-3">
                          {deal.events.map((e, j) => (
                            <li key={j} className="flex items-baseline gap-3 py-0.5 text-[12.5px]">
                              <span className="shrink-0 font-mono text-faint tabular-nums whitespace-nowrap">
                                {new Date(e.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
                              </span>
                              <span className="w-[4.5rem] shrink-0 text-faint">
                                {e.actor === deal.you ? "you" : e.actor === "system" ? "system" : "demo bot"}
                              </span>
                              <span>{ACTION_LABEL[e.action] ?? e.action}</span>
                              <span className="ml-auto hidden text-faint sm:inline">{STATE_LABEL[e.state]}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </li>
                  ) : null;
                }
                return (
                  <ChatMessage
                    key={item.id}
                    who={item.kind === "you" ? "you" : "bot"}
                    at={item.at}
                    tone={item.kind === "bot" ? item.tone : undefined}
                    links={item.kind === "bot" ? item.links : undefined}
                    grouped={sameSender}
                  >
                    {item.text}
                  </ChatMessage>
                );
              })}
              {busy && (
                <li className="flex items-center gap-3 px-4 pt-4 text-[13.5px] text-muted" role="status">
                  <span className="hf-typing w-9 shrink-0" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  {busy}
                </li>
              )}
            </ol>
          )}
        </div>

        {!offline && (
          <div className="hf-composer border-t border-line px-4 py-4">
            {!deal ? (
              <StartForm
                role={role}
                setRole={setRole}
                amount={amount}
                setAmount={setAmount}
                description={description}
                setDescription={setDescription}
                disabled={!!busy || health === "checking"}
                onStart={start}
              />
            ) : closed ? (
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="hf-btn hf-btn-primary" onClick={startOver}>
                  Start another trade
                </button>
                <p className="text-[13px] text-faint">Every step above is on Sepolia for good: open the links to see.</p>
              </div>
            ) : panel ? (
              <PanelForm
                panel={panel}
                value={field}
                setValue={setField}
                demoAddress={typeof health === "object" ? health.treasury.value : null}
                disabled={!!busy}
                onCancel={() => {
                  setPanel(null);
                  setField("");
                }}
                onSubmit={submitPanel}
              />
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {actions.has("pay") && (
                  <button type="button" className="hf-btn hf-btn-primary" disabled={!!busy} onClick={pay}>
                    Pay {deal.amount.text}
                  </button>
                )}
                {sellerNeedsAddress && (
                  <button type="button" className="hf-btn hf-btn-primary" disabled={!!busy} onClick={() => setPanel("payout")}>
                    Set where you&apos;re paid
                  </button>
                )}
                {actions.has("confirm") && (
                  <button
                    type="button"
                    className="hf-btn hf-btn-primary"
                    disabled={!!busy}
                    onClick={() => act("confirm", "I have it. Release the money.")}
                  >
                    Confirm delivery
                  </button>
                )}
                {actions.has("deliver") && (
                  <button
                    type="button"
                    className="hf-btn hf-btn-primary"
                    disabled={!!busy || sellerNeedsAddress}
                    onClick={() => act("deliver", "Delivered.")}
                    title={sellerNeedsAddress ? "Set where you're paid first" : undefined}
                  >
                    Mark delivered
                  </button>
                )}
                {buyerNeedsRefundAddress && (
                  <button type="button" className="hf-btn hf-btn-primary" disabled={!!busy} onClick={() => setPanel("refund_address")}>
                    Set where you&apos;re refunded
                  </button>
                )}
                {actions.has("respond") && (
                  <button type="button" className="hf-btn" disabled={!!busy} onClick={() => setPanel("respond")}>
                    Answer the dispute
                  </button>
                )}
                {actions.has("dispute") && (
                  <button type="button" className="hf-btn" disabled={!!busy} onClick={() => setPanel("dispute")}>
                    Open a dispute
                  </button>
                )}
                {actions.has("refund") && (
                  <button type="button" className="hf-btn" disabled={!!busy} onClick={() => act("refund", "Refund the buyer.")}>
                    Refund the buyer
                  </button>
                )}
                {actions.has("cancel") && (
                  <button type="button" className="hf-btn hf-btn-danger" disabled={!!busy} onClick={() => act("cancel", "Cancel the deal.")}>
                    Cancel
                  </button>
                )}
                {deal.actions.length === 0 && !busy && (
                  <p className="text-[13px] text-faint">Waiting on the network. This updates by itself.</p>
                )}
                <button type="button" className="ml-auto text-[12.5px] text-faint hover:text-ink" onClick={startOver}>
                  Start over
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="lg:sticky lg:top-24">
        <UnderTheHood deal={deal} />
      </div>
    </div>
  );
}

function StartForm(props: {
  role: "buyer" | "seller";
  setRole: (r: "buyer" | "seller") => void;
  amount: string;
  setAmount: (a: string) => void;
  description: string;
  setDescription: (d: string) => void;
  disabled: boolean;
  onStart: () => void;
}) {
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        props.onStart();
      }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <fieldset className="hf-segment" aria-label="Your side">
          {(["buyer", "seller"] as const).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={props.role === r}
              className={props.role === r ? "on" : ""}
              onClick={() => props.setRole(r)}
            >
              {r === "buyer" ? "I'm buying" : "I'm selling"}
            </button>
          ))}
        </fieldset>
        <fieldset className="flex items-center gap-1.5" aria-label="Amount">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={props.amount === a}
              className={`hf-chip ${props.amount === a ? "on" : ""}`}
              onClick={() => props.setAmount(a)}
            >
              {a} tUSD
            </button>
          ))}
        </fieldset>
      </div>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="hf-description">
          What&apos;s being traded
        </label>
        <input
          id="hf-description"
          className="hf-input min-w-0 flex-1"
          value={props.description}
          maxLength={120}
          onChange={(e) => props.setDescription(e.target.value)}
          placeholder="What's being traded"
        />
        <button type="submit" className="hf-btn hf-btn-primary shrink-0" disabled={props.disabled}>
          Start the trade
        </button>
      </div>
      <p className="text-[12px] text-faint">
        {props.role === "buyer"
          ? "You pay; the demo bot sells. Nothing to install and no wallet: test dollars are minted for you."
          : "The demo bot buys and pays you. Its payment is a real Sepolia transaction, so starting takes about half a minute."}
      </p>
    </form>
  );
}

function PanelForm(props: {
  panel: Exclude<Panel, null>;
  value: string;
  setValue: (v: string) => void;
  demoAddress: string | null;
  disabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const address = props.panel === "payout" || props.panel === "refund_address";
  const label = {
    payout: "Where should you be paid? Paste a Sepolia address, or use the demo's own wallet so the test dollars go back to it.",
    refund_address: "Where should your refund go? Paste a Sepolia address, or use the demo's own wallet.",
    dispute: "What went wrong? The other side sees this.",
    respond: "Your answer to the dispute (optional).",
  }[props.panel];
  return (
    <form
      className="space-y-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
    >
      <label htmlFor="hf-field" className="block text-[13px] text-muted">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id="hf-field"
          autoFocus
          className={`hf-input min-w-0 flex-1 ${address ? "font-mono text-[13px]" : ""}`}
          value={props.value}
          maxLength={address ? 42 : 300}
          placeholder={address ? "0x..." : props.panel === "dispute" ? "The logo never arrived" : "Optional"}
          onChange={(e) => props.setValue(e.target.value)}
        />
        <button type="submit" className="hf-btn hf-btn-primary" disabled={props.disabled}>
          {address ? "Save" : props.panel === "dispute" ? "Open the dispute" : "Send"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {address && props.demoAddress && (
          <button type="button" className="hf-btn" onClick={() => props.setValue(props.demoAddress ?? "")}>
            Use the demo wallet
          </button>
        )}
        <button type="button" className="hf-btn" onClick={props.onCancel}>
          Never mind
        </button>
      </div>
    </form>
  );
}
