// The Holdfast API, as the playground uses it: types that mirror its schemas, and a small client.
// Holdfast runs on Ethereum's Sepolia test network only; its dollar (tUSD) has no value.

/** Where the API lives. NEXT_PUBLIC_HOLDFAST_API overrides it for local development (a `holdfast-api --fake`). */
export const HOLDFAST_API = (
  process.env.NEXT_PUBLIC_HOLDFAST_API || "https://ip-172-31-17-7.tail64d2eb.ts.net:8443"
).replace(/\/$/, "");

export const HOLDFAST_REPO = "https://github.com/danibapsilva/holdfast";
export const TUSD_CONTRACT = "0xD0841FE19d653C0F8E31Ba5c825f23D9ad3aa99b";
export const TUSD_CONTRACT_URL = `https://sepolia.etherscan.io/address/${TUSD_CONTRACT}`;

/** Creating a deal as the seller, and paying as the buyer, wait for a Sepolia receipt (12 to 30 s). */
const SLOW_MS = 60_000;
const FAST_MS = 15_000;

export type Role = "buyer" | "seller" | "system" | "arbiter";

export type State =
  | "draft"
  | "awaiting_terms_acceptance"
  | "awaiting_payment"
  | "partially_paid"
  | "confirming"
  | "funded"
  | "release_pending"
  | "released"
  | "refund_pending"
  | "refunded"
  | "disputed"
  | "cancelled"
  | "expired";

export const CLOSED: State[] = ["released", "refunded", "cancelled", "expired"];

/** What the API lets the caller do now (it never lists one the deal would refuse). */
export type DealAction =
  | "pay"
  | "cancel"
  | "deliver"
  | "confirm"
  | "refund"
  | "dispute"
  | "respond"
  | "payout_address"
  | "refund_address";

export type Amount = { units: string; text: string };
export type Link = { value: string; url: string };

export type Payment = { tx: Link; amount: Amount; confirmations: number; counted: boolean };
export type DealEvent = { at: string; actor: Role; action: string; state: State };
export type Dispute = { opened_by: Role; reason: string; settle_at: string; responded: boolean; winner: Role | null };

export type Deal = {
  id: string;
  state: State;
  you: Role;
  with_demo_bot: boolean;
  description: string;
  amount: Amount;
  fee: Amount;
  payout: Amount;
  received: Amount;
  confirmed: Amount;
  required_confirmations: number;
  deadline: string | null;
  deposit: Link | null;
  payout_address: string | null;
  refund_address: string | null;
  payments: Payment[];
  events: DealEvent[];
  dispute: Dispute | null;
  settlements: Link[];
  needs_review: boolean;
  actions: DealAction[];
};

export type Health = {
  ok: boolean;
  network: string;
  chain_id: number;
  head: number;
  token: string;
  token_address: string | null;
  treasury: Link;
};

/** A refusal from the API (its message was written to be shown to the visitor), or a network failure. */
export class HoldfastError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HoldfastError";
  }
}

async function call<T>(path: string, init: RequestInit & { token?: string; timeout?: number } = {}): Promise<T> {
  const { token, timeout = FAST_MS, ...rest } = init;
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), timeout);
  try {
    const res = await fetch(`${HOLDFAST_API}${path}`, {
      ...rest,
      signal: abort.signal,
      headers: {
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
    if (!res.ok) throw new HoldfastError(data?.error ?? `The demo answered ${res.status}`, res.status);
    return data as T;
  } catch (error) {
    if (error instanceof HoldfastError) throw error;
    if (abort.signal.aborted) throw new HoldfastError("The test network is taking too long; try again", 504);
    throw new HoldfastError("Couldn't reach the demo server", 0);
  } finally {
    clearTimeout(timer);
  }
}

const post = <T>(path: string, token: string, body?: object, slow = false) =>
  call<T>(path, { method: "POST", token, body: body ? JSON.stringify(body) : undefined, timeout: slow ? SLOW_MS : FAST_MS });

export const holdfast = {
  health: () => call<Health>("/health"),
  start: (role: "buyer" | "seller", amount: string, description: string) =>
    call<{ token: string; deal: Deal }>("/demo/deals", {
      method: "POST",
      body: JSON.stringify({ role, amount, description }),
      timeout: role === "seller" ? SLOW_MS : FAST_MS,
    }),
  deal: (id: string, token: string) => call<Deal>(`/deals/${id}`, { token }),
  pay: (id: string, token: string) => post<{ tx: Link; deal: Deal }>(`/deals/${id}/pay`, token, undefined, true),
  /** One of the party actions that returns the deal as it now stands. Settling sends money, so it may be slow. */
  act: (id: string, token: string, action: "cancel" | "deliver" | "confirm" | "refund") =>
    post<Deal>(`/deals/${id}/${action}`, token, undefined, true),
  dispute: (id: string, token: string, reason: string) => post<Deal>(`/deals/${id}/dispute`, token, { reason }),
  respond: (id: string, token: string, note: string) => post<Deal>(`/deals/${id}/respond`, token, { note }),
  payoutAddress: (id: string, token: string, address: string) =>
    post<Deal>(`/deals/${id}/payout-address`, token, { address }, true),
  refundAddress: (id: string, token: string, address: string) =>
    post<Deal>(`/deals/${id}/refund-address`, token, { address }, true),
};

/** A trade in progress, kept in this browser so a refresh picks it up. */
export type Session = { id: string; token: string };
const SESSION_KEY = "holdfast-demo";

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const s = raw ? (JSON.parse(raw) as Session) : null;
    return s && typeof s.id === "string" && typeof s.token === "string" ? s : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // private browsing: the trade just won't survive a refresh
  }
}

export const isAddress = (text: string) => /^0x[0-9a-fA-F]{40}$/.test(text.trim());
export const short = (hex: string) => `${hex.slice(0, 6)}…${hex.slice(-4)}`;
