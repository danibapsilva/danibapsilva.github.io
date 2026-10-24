import type { Glyph as GlyphName } from "@/lib/content";

const PATHS: Record<GlyphName, React.ReactNode> = {
  card: (
    <>
      <rect x="3" y="6" width="18" height="12.5" rx="2.5" />
      <path d="M3 10h18M7 15h3.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 19 6v5.4c0 4.3-2.9 7.9-7 9.4-4.1-1.5-7-5.1-7-9.4V6z" />
      <path d="m9 12.2 2.1 2.1 4-4.3" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5 5.6 4.5h12.8L20 9.5" />
      <path d="M4 9.5c0 1.5 1.2 2.5 2.7 2.5s2.6-1 2.6-2.5c0 1.5 1.2 2.5 2.7 2.5s2.7-1 2.7-2.5c0 1.5 1.1 2.5 2.6 2.5S20 11 20 9.5" />
      <path d="M5.5 12v7.5h13V12M10 19.5v-4h4v4" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="9" ry="4.2" transform="rotate(-25 12 12)" />
      <circle cx="19.2" cy="8.4" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
};

/** A project's mark, in a soft tile of its color. */
export function Glyph({ name, tone, size = 40 }: { name: GlyphName; tone: string; size?: number }) {
  return (
    <span
      className="tone-tile grid shrink-0 place-items-center rounded-xl"
      style={{ "--tone": tone, width: size, height: size } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {PATHS[name]}
      </svg>
    </span>
  );
}
