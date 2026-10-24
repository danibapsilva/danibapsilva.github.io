/** A numbered section heading: "01  Selected work". */
export function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="label reveal mb-7 flex items-center gap-3">
      <span className="text-accent">{n}</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
    </h2>
  );
}
