import { ArrowHead, Box, Group, Line } from "@/components/diagram-kit";

const STAGES = ["Parse", "Validate", "Dedupe", "Rules", "Route"];
const NETWORKS = [
  ["Mastercard", "CIS/IPM"],
  ["Visa", "VIP/BASE II"],
  ["Amex", "GCAG/GFSG"],
  ["Discover", "Auth/Sales"],
];

/** The payment engine: an authorization pipeline in front of per-network adapters, with batch clearing below. */
export function PaymentsDiagram() {
  return (
    <svg
      viewBox="0 0 360 330"
      role="img"
      aria-label="Requests from the acquirer pass through parse, validate, dedupe (Redis), rules (MySQL), and route stages, then go to Mastercard, Visa, Amex, and Discover adapters; the adapters also produce batch clearing and settlement files."
      className="mx-auto block w-full max-w-[540px] font-mono"
    >
      <ArrowHead />
      <Box x={110} y={6} w={140} h={30} label="Terminal / acquirer" />
      <Line x1={180} y1={36} x2={180} y2={58} label="ISO 8583" />

      <Group x={6} y={60} w={348} h={112} label="Authorization pipeline · LMAX Disruptor" />
      {STAGES.map((s, i) => (
        <g key={s}>
          <Box x={16 + i * 67} y={82} w={60} h={30} label={s} strong />
          {i < STAGES.length - 1 && <Line x1={76 + i * 67} y1={97} x2={83 + i * 67} y2={97} />}
        </g>
      ))}
      <Line x1={180} y1={112} x2={180} y2={132} dashed />
      <Box x={150} y={134} w={60} h={28} label="Redis" sub="duplicates" dashed />
      <Line x1={247} y1={112} x2={247} y2={132} dashed />
      <Box x={217} y={134} w={60} h={28} label="MySQL" sub="live rules" dashed />

      <Line x1={180} y1={172} x2={180} y2={194} />
      <Group x={6} y={196} w={348} h={70} label="Network adapters" />
      {NETWORKS.map(([n, f], i) => (
        <Box key={n} x={16 + i * 84} y={218} w={76} h={36} label={n} sub={f} />
      ))}

      <Line x1={180} y1={266} x2={180} y2={288} label="files" />
      <Box x={60} y={290} w={240} h={32} label="Batch clearing and settlement" strong />
    </svg>
  );
}
