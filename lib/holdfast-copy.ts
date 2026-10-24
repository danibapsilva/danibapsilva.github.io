// What Holdfast says in the playground at each point of a trade, and what's happening underneath.
import type { Deal, State } from "@/lib/holdfast";

/** The bot's message when a deal arrives in `state`, as the visitor's side sees it. */
export function narrate(deal: Deal): string {
  const buyer = deal.you === "buyer";
  const amount = deal.amount.text;
  switch (deal.state) {
    case "awaiting_payment":
      return buyer
        ? `Your deal is open. Pay ${amount} into its deposit address: the button mints test dollars straight to it, so you don't need a wallet.`
        : `Your deal is open, and the demo bot has paid ${amount} into its deposit address. I'm watching Sepolia for it.`;
    case "partially_paid":
      return `Part of the payment is in (${deal.received.text} of ${amount}). The deal waits for the rest until its deadline, then refunds what came in.`;
    case "confirming":
      return `I see ${deal.received.text} on-chain. Waiting for ${deal.required_confirmations} confirmations, so the payment can't be undone by a reorganized block.`;
    case "funded":
      return buyer
        ? `Funded. ${amount} is locked at the deal's own address. When you have what you paid for, confirm delivery to release it to the seller, or open a dispute.`
        : `Funded. The buyer's ${amount} is locked at the deal's own address. Deliver, then mark it delivered: the demo bot confirms and the money is released to you.`;
    case "release_pending":
      return `Delivery confirmed. Sending ${deal.payout.text} to the seller now.`;
    case "released":
      return buyer
        ? `Released. The seller was paid ${deal.payout.text}; the demo's ${deal.fee.text} fee stays at the deposit address.`
        : `Released. You were paid ${deal.payout.text}; the demo's ${deal.fee.text} fee stays at the deposit address.`;
    case "refund_pending":
      return `This deal is being refunded: everything received goes back to the buyer.`;
    case "refunded":
      return `Refunded. ${deal.received.text} went back to the buyer.`;
    case "disputed":
      return deal.dispute
        ? `Dispute open: "${deal.dispute.reason}". If the other side doesn't answer, the timer settles it for whoever opened it; if both sides answer, the buyer is refunded.`
        : "Dispute open.";
    case "cancelled":
      return "Cancelled before any money moved.";
    case "expired":
      return "The deadline passed with nothing paid, so the deal expired.";
    default:
      return `The deal is ${deal.state.replaceAll("_", " ")}.`;
  }
}

/** The steps a trade passes through, for the progress rail. */
export const STEPS: { label: string; states: State[] }[] = [
  { label: "Terms agreed", states: ["awaiting_terms_acceptance", "awaiting_payment"] },
  { label: "Paid", states: ["partially_paid", "confirming"] },
  { label: "Funded in escrow", states: ["funded", "disputed"] },
  { label: "Settling", states: ["release_pending", "refund_pending"] },
  { label: "Done", states: ["released", "refunded", "cancelled", "expired"] },
];

export const stepOf = (state: State | null) =>
  state === null ? -1 : STEPS.findIndex((s) => s.states.includes(state));

/** The under-the-hood note for where the trade is now. */
export function underTheHood(deal: Deal | null): { title: string; body: string[]; money: string } {
  if (!deal) {
    return {
      title: "Before a deal",
      body: [
        "Every trade is a small state machine. A table decides which side may take which action in which state, and refuses everything else with a plain message.",
        "Pick a side and an amount. The demo bot takes the other side, so you can play a whole trade alone.",
      ],
      money: "Nowhere yet.",
    };
  }
  const where = deal.deposit ? "at the deal's own deposit address" : "nowhere yet";
  switch (deal.state) {
    case "awaiting_payment":
    case "partially_paid":
      return {
        title: "Waiting for the payment",
        body: [
          "The deposit address belongs to this deal alone. It's derived from one secret seed (BIP-44, address index = deal number), so no key file is ever written to disk.",
          "A watcher reads the tUSD contract's Transfer logs for that address every few seconds. Each transfer is keyed by its transaction hash and log index, and claimed by one deal only, so the same payment can never count twice.",
        ],
        money: deal.received.units === "0" ? "Nowhere yet." : `${deal.received.text} ${where}, not yet confirmed.`,
      };
    case "confirming":
      return {
        title: "Counting confirmations",
        body: [
          `A payment counts once it's ${deal.required_confirmations} blocks deep. A block that's only just been mined can still be replaced, and an escrow that released money against it could pay for something that never happened.`,
          "Amounts are integers in the token's smallest unit throughout: no floating point ever touches the money.",
        ],
        money: `${deal.received.text} ${where}, confirming.`,
      };
    case "funded":
    case "disputed":
      return {
        title: deal.state === "funded" ? "Held in escrow" : "Disputed",
        body: [
          "Neither side can move the money now. Only the buyer's confirmation releases it to the seller; only a refund or a dispute's outcome sends it back.",
          "A dispute waits for the other side. If they never answer, whoever opened it wins; if both answer, the buyer is refunded, because returning money to whoever paid it can't strand anyone's funds.",
        ],
        money: `${deal.received.text} ${where}.`,
      };
    case "release_pending":
    case "refund_pending":
      return {
        title: "Sending the money",
        body: [
          "Before anything is sent, the deal records that its payout has started, and saves that. If a send failed halfway, the deal is flagged for a person instead of retried: a blind retry is how escrows pay twice.",
          "The deposit address needs a little test ETH for gas, so the treasury tops it up first. Gas limits come from the network's own estimate plus a margin, never a fixed number.",
        ],
        money: `${deal.received.text} ${where}, on its way out.`,
      };
    default:
      return {
        title: "Settled",
        body: [
          "The deal is closed and its full history is the event log below: every action, who took it, and the state it left the deal in.",
          "On a real network the same code would run unchanged. Holdfast refuses to start on any network but Sepolia, checks again before every send, and caps every deal and each day's sending.",
        ],
        money:
          deal.state === "released"
            ? `${deal.payout.text} with the seller; the ${deal.fee.text} fee at the deposit address.`
            : deal.state === "refunded"
              ? `${deal.received.text} back with the buyer.`
              : "None moved.",
      };
  }
}

/** Plain names for the event log's actions. */
export const ACTION_LABEL: Record<string, string> = {
  propose: "Proposed",
  accept_terms: "Terms accepted",
  edit_terms: "Terms edited",
  cancel: "Cancelled",
  record_payment: "Payment recorded",
  expire: "Expired",
  mark_delivered: "Marked delivered",
  confirm_delivery: "Delivery confirmed",
  request_refund: "Refund requested",
  open_dispute: "Dispute opened",
  respond_dispute: "Dispute answered",
  resolve_dispute: "Dispute resolved",
  auto_settle: "Settled by the timer",
  set_payout_address: "Payout address set",
  set_refund_address: "Refund address set",
  begin_payout: "Payout started",
  mark_released: "Released",
  mark_refunded: "Refunded",
};

export const STATE_LABEL: Record<State, string> = {
  draft: "Draft",
  awaiting_terms_acceptance: "Awaiting acceptance",
  awaiting_payment: "Awaiting payment",
  partially_paid: "Partly paid",
  confirming: "Confirming",
  funded: "Funded",
  release_pending: "Releasing",
  released: "Released",
  refund_pending: "Refunding",
  refunded: "Refunded",
  disputed: "Disputed",
  cancelled: "Cancelled",
  expired: "Expired",
};
