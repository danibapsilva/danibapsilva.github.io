import { SKILLS } from "@/lib/content";

type Chip = { item: string; tone: string };

const chips = (labels: string[]): Chip[] =>
  SKILLS.filter((s) => labels.includes(s.label)).flatMap((s) => s.items.map((item) => ({ item, tone: s.tone })));

const ROWS: { items: Chip[]; reverse: boolean; seconds: number }[] = [
  { items: chips(["Languages", "Systems"]), reverse: false, seconds: 46 },
  { items: chips(["Frameworks", "Data and cloud"]), reverse: true, seconds: 40 },
];

function Row({ items, reverse, seconds }: (typeof ROWS)[number]) {
  // the list twice, so sliding it by half loops without a seam; the copy is hidden from screen readers
  return (
    <div className="marquee">
      <ul className={`marquee-track ${reverse ? "reverse" : ""}`} style={{ animationDuration: `${seconds}s` }}>
        {[...items, ...items].map((c, i) => (
          <li key={`${c.item}-${i}`} className="skill-chip" aria-hidden={i >= items.length || undefined}>
            <span className="skill-dot" style={{ background: c.tone }} />
            {c.item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The tools I use, as two slow rows drifting in opposite directions; they pause under the pointer and stay
 * still for anyone who prefers less motion. */
export function SkillsMarquee() {
  return (
    <div className="reveal">
      <div className="space-y-2.5">
        {ROWS.map((r, i) => (
          <Row key={i} {...r} />
        ))}
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
        {SKILLS.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="skill-dot" style={{ background: s.tone }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
