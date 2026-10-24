import { STEPS, stepOf, underTheHood } from "@/lib/holdfast-copy";
import type { Deal } from "@/lib/holdfast";

/** Beside the chat: where the trade is in its life, what the engine is doing now, and where the money is. */
export function UnderTheHood({ deal }: { deal: Deal | null }) {
  const note = underTheHood(deal);
  const at = stepOf(deal?.state ?? null);
  return (
    <aside className="hf-panel rounded-2xl border border-line bg-surface p-5" aria-label="Under the hood">
      <p className="label">Under the hood</p>
      <ol className="mt-4 space-y-2.5">
        {STEPS.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3 text-[13.5px]">
            <span className={`hf-step ${i < at ? "done" : i === at ? "now" : ""}`} aria-hidden="true" />
            <span className={i === at ? "font-medium text-ink" : i < at ? "text-muted" : "text-faint"}>
              {s.label}
              {i === at && <span className="sr-only"> (now)</span>}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-[15px] font-medium">{note.title}</p>
        {note.body.map((p) => (
          <p key={p} className="mt-2 text-[13.5px] leading-relaxed text-muted">
            {p}
          </p>
        ))}
        <p className="mt-4 rounded-lg bg-[var(--accent-soft)] px-3 py-2 text-[13px] leading-relaxed">
          <span className="font-medium">Where the money is: </span>
          {note.money}
        </p>
        {deal && <p className="label mt-3">State machine: {deal.state}</p>}
      </div>
    </aside>
  );
}
