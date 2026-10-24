import { ArrowHead, Box, Group, Line } from "@/components/diagram-kit";

const SOURCES = [
  ["Canvas", "Gradescope", "Calendar", "Gmail"],
  ["Plaid", "Job boards", "Piazza"],
];

/** Orbit: every source flows through one pipeline into the vault, and the phone app reads the vault. */
export function OrbitDiagram() {
  return (
    <svg
      viewBox="0 0 360 282"
      role="img"
      aria-label="Canvas, Gradescope, Google Calendar, Gmail, Plaid, job boards, and Piazza feed a Python pipeline that runs on timers on AWS EC2, with Claude for briefings, summaries, and form answers. The pipeline writes Markdown and JSON into an Obsidian vault synced with git, and a Next.js PWA on the phone reads and edits the vault. The pipeline also sends phone notifications."
      className="mx-auto block w-full max-w-[540px] font-mono"
    >
      <ArrowHead />
      <Group x={6} y={6} w={348} h={92} label="Sources" />
      {SOURCES[0].map((s, i) => (
        <Box key={s} x={16 + i * 84} y={28} w={76} h={24} label={s} />
      ))}
      {SOURCES[1].map((s, i) => (
        <Box key={s} x={58 + i * 84} y={62} w={76} h={24} label={s} />
      ))}

      <Line x1={180} y1={98} x2={180} y2={118} />
      <Box x={90} y={120} w={180} h={36} label="Python pipeline" sub="AWS EC2 · on timers" strong />
      <Line x1={270} y1={138} x2={286} y2={138} dashed />
      <Box x={288} y={120} w={66} h={36} label="Claude" sub="briefs, answers" dashed />

      <Line x1={180} y1={156} x2={180} y2={176} />
      <Box x={90} y={178} w={180} h={36} label="Obsidian vault" sub="Markdown + JSON · git" />

      <Line x1={180} y1={214} x2={180} y2={234} />
      <Box x={90} y={236} w={180} h={36} label="Next.js PWA" sub="reads and edits the vault" strong />

      <path
        d="M90 146 H45 V234"
        fill="none"
        stroke="var(--faint)"
        strokeWidth={1}
        strokeDasharray="3 3"
        markerEnd="url(#arrow)"
      />
      <Box x={6} y={236} w={78} h={36} label="Push" sub="to my phone" dashed />
    </svg>
  );
}
