/** The two people in the channel: Holdfast (the escrow bot, a shield on its color) and you. */
export function Avatar({ who }: { who: "bot" | "you" }) {
  if (who === "you") {
    return (
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] text-[13px] font-semibold text-muted"
        aria-hidden="true"
      >
        You
      </span>
    );
  }
  return (
    <span className="hf-avatar grid h-9 w-9 shrink-0 place-items-center rounded-full" aria-hidden="true">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.2 19 6v5.4c0 4.3-2.9 7.9-7 9.4-4.1-1.5-7-5.1-7-9.4V6z" />
        <path d="m9 12.2 2.1 2.1 4-4.3" />
      </svg>
    </span>
  );
}
