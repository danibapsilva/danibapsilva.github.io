import { ArrowHead, Box, Group, Line } from "@/components/diagram-kit";

const FLOW = [
  ["Order", "placed"],
  ["Stripe", "payment"],
  ["Delivery", "automated"],
];

/** BrawlMart: one marketplace in two places, every order paid through Stripe and delivered automatically. */
export function BrawlmartDiagram() {
  return (
    <svg
      viewBox="0 0 360 250"
      role="img"
      aria-label="Customers order from the Next.js web storefront or from Discord through a Discord.py bot. Each order is paid through Stripe and then delivered automatically. Disputes and customer support sit behind it."
      className="mx-auto block w-full max-w-[540px] font-mono"
    >
      <ArrowHead />
      <Box x={20} y={6} w={150} h={34} label="Web storefront" sub="Next.js" />
      <Box x={190} y={6} w={150} h={34} label="Discord" sub="Discord.py bot" />
      <Line x1={95} y1={40} x2={150} y2={76} />
      <Line x1={265} y1={40} x2={210} y2={76} />

      <Group x={6} y={78} w={348} h={86} label="Every order" />
      {FLOW.map(([label, sub], i) => (
        <g key={label}>
          <Box x={22 + i * 112} y={102} w={92} h={36} label={label} sub={sub} strong />
          {i < FLOW.length - 1 && <Line x1={114 + i * 112} y1={120} x2={132 + i * 112} y2={120} />}
        </g>
      ))}

      <Line x1={180} y1={164} x2={180} y2={190} />
      <Box x={70} y={192} w={220} h={34} label="Operations" sub="disputes · customer support" dashed />
      <text x={180} y={244} textAnchor="middle" fontSize={8.5} fill="var(--faint)">
        15,000+ users across the web and Discord
      </text>
    </svg>
  );
}
