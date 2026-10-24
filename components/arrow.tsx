/** A small arrow for links: up-right for leaving the site, right for going deeper, left for back. */
export function Arrow({ dir = "out", className = "" }: { dir?: "out" | "right" | "left"; className?: string }) {
  const d = { out: "M7 17 17 7M9 7h8v8", right: "M5 12h14M13 6l6 6-6 6", left: "M19 12H5M11 6l-6 6 6 6" }[dir];
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
    >
      <path d={d} />
    </svg>
  );
}
