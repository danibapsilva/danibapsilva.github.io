// Small pieces for the case-study diagrams: boxes, labels, and arrows that take the page's colors.

type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  strong?: boolean;
  dashed?: boolean;
};

export function Box({ x, y, w, h, label, sub, strong, dashed }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={7}
        fill={strong ? "var(--accent-soft)" : "var(--bg)"}
        stroke={strong ? "var(--accent)" : "var(--line)"}
        strokeWidth={strong ? 1.2 : 1}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? -3 : 3.5)}
        textAnchor="middle"
        fontSize={11}
        fontWeight={strong ? 600 : 500}
        fill="var(--ink)"
      >
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize={8.5} fill="var(--faint)">
          {sub}
        </text>
      )}
    </g>
  );
}

/** A labeled group around other boxes. */
export function Group({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke="var(--accent)" strokeOpacity={0.45} />
      <text x={x + 10} y={y + 15} fontSize={9.5} fill="var(--accent)" fontWeight={600}>
        {label}
      </text>
    </g>
  );
}

/** A straight arrow from (x1, y1) to (x2, y2), with an optional label beside it. */
export function Line({
  x1,
  y1,
  x2,
  y2,
  label,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  dashed?: boolean;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--faint)"
        strokeWidth={1}
        strokeDasharray={dashed ? "3 3" : undefined}
        markerEnd="url(#arrow)"
      />
      {label && (
        <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 + 3} fontSize={8.5} fill="var(--faint)">
          {label}
        </text>
      )}
    </g>
  );
}

export function ArrowHead() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 8 4 0 8z" fill="var(--faint)" />
      </marker>
    </defs>
  );
}
