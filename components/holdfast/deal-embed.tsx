import { STATE_LABEL } from "@/lib/holdfast-copy";
import { CLOSED, type Deal, short } from "@/lib/holdfast";

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="text-[11.5px] font-semibold tracking-wide text-faint uppercase">{label}</dt>
      <dd className="mt-0.5 text-[13.5px]">{children}</dd>
    </div>
  );
}

function until(iso: string, now: number): string {
  const minutes = Math.max(0, Math.round((Date.parse(iso) - now) / 60_000));
  return minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`;
}

/** The deal as an embed card that stays live: its state, the money, the deposit address, and confirmations. */
export function DealEmbed({ deal, now }: { deal: Deal; now: number }) {
  const closed = CLOSED.includes(deal.state);
  const confirmations = Math.max(0, ...deal.payments.map((p) => p.confirmations));
  const needed = deal.required_confirmations;
  const shownConfirmations = Math.min(confirmations, needed);
  return (
    <div className="hf-embed mt-2 max-w-[520px] rounded-md py-3 pr-4 pl-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14.5px] font-semibold">Deal #{deal.id.slice(0, 6)}</p>
        <span className={`hf-state hf-state-${closed ? "closed" : deal.state === "disputed" ? "warn" : "open"}`}>
          {STATE_LABEL[deal.state]}
        </span>
      </div>
      <p className="mt-1 text-[13.5px] text-muted">&ldquo;{deal.description}&rdquo;</p>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
        <Field label="You are">The {deal.you}</Field>
        <Field label="Amount">{deal.amount.text}</Field>
        <Field label="Seller gets">{deal.payout.text}</Field>
        <Field label="Demo fee">{deal.fee.text}</Field>
        <Field label="Received">{deal.received.text}</Field>
        <Field label="Confirmations">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="hf-meter" aria-hidden="true">
              <span style={{ width: `${(shownConfirmations / needed) * 100}%` }} />
            </span>
            <span className="font-mono text-[12.5px] tabular-nums">
              {shownConfirmations} of {needed}
            </span>
          </span>
        </Field>
        {deal.deposit && (
          <Field label="Deposit address" wide>
            <a href={deal.deposit.url} target="_blank" rel="noopener noreferrer" className="hf-link font-mono text-[12.5px]">
              {short(deal.deposit.value)}
            </a>
            <span className="text-faint"> · this deal&apos;s own address</span>
          </Field>
        )}
      </dl>
      {!closed && deal.deadline && ["awaiting_payment", "partially_paid"].includes(deal.state) && (
        <p className="mt-3 text-[12px] text-faint">Payment window closes in {until(deal.deadline, now)}</p>
      )}
    </div>
  );
}
