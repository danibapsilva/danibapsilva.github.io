import { ArrowHead, Box, Group, Line } from "@/components/diagram-kit";

const STEPS = [
  ["Agree", "the terms"],
  ["Deposit", "into escrow"],
  ["Verify", "on-chain"],
  ["Release", "or refund"],
];

/** The escrow: a deal flow run from Discord, wallets on each chain, and everything logged. */
export function EscrowDiagram() {
  return (
    <svg
      viewBox="0 0 360 318"
      role="img"
      aria-label="A buyer and seller start a deal in Discord; the escrow agrees terms, takes the deposit into a hot wallet, verifies it on-chain with fraud checks, then releases or refunds. Deals and logs go to MongoDB on AWS."
      className="mx-auto block w-full max-w-[540px] font-mono"
    >
      <ArrowHead />
      <Box x={40} y={6} w={110} h={30} label="Buyer" />
      <Box x={210} y={6} w={110} h={30} label="Seller" />
      <Line x1={95} y1={36} x2={150} y2={60} />
      <Line x1={265} y1={36} x2={210} y2={60} />
      <Box x={130} y={62} w={100} h={26} label="Discord" />
      <Line x1={180} y1={88} x2={180} y2={108} />

      <Group x={6} y={110} w={348} h={96} label="Escrow deal" />
      {STEPS.map(([s, sub], i) => (
        <g key={s}>
          <Box x={16 + i * 84} y={130} w={72} h={34} label={s} sub={sub} strong />
          {i < STEPS.length - 1 && <Line x1={88 + i * 84} y1={147} x2={98 + i * 84} y2={147} />}
        </g>
      ))}
      <Line x1={220} y1={164} x2={220} y2={174} dashed />
      <Box x={172} y={176} w={96} h={24} label="Fraud checks" dashed />

      <Line x1={93} y1={206} x2={93} y2={228} />
      <Box x={20} y={230} w={146} h={34} label="Hot wallets" sub="BTC · ETH · USDT · more" />
      <Line x1={166} y1={247} x2={194} y2={247} />
      <Box x={196} y={230} w={144} h={34} label="Blockchains" sub="BTC, Ethereum, and more" />

      <Line x1={180} y1={264} x2={180} y2={282} />
      <Box x={70} y={284} w={220} h={28} label="MongoDB logs · AWS EC2 and S3" />
    </svg>
  );
}
