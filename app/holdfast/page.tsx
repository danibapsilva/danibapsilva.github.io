import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { Playground } from "@/components/holdfast/playground";
import { HOLDFAST_REPO, TUSD_CONTRACT_URL } from "@/lib/holdfast";

const TONE = "#10b981"; // the escrow project's color

export const metadata: Metadata = {
  title: "Holdfast: live escrow demo",
  description:
    "Run a real escrow trade on Ethereum's Sepolia test network: pay, watch it confirm, and release, with a bot on the other side. No wallet needed.",
};

const FACTS = ["No wallet or install", "Real Sepolia transactions", "Test dollars with no value"];

export default function HoldfastPage() {
  return (
    <div className="case relative" style={{ "--tone": TONE } as React.CSSProperties}>
      <div className="case-glow" aria-hidden="true" />
      {/* wider than the reading column: the chat and its notes sit side by side on a laptop */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="mx-auto max-w-[1100px] px-5 pt-12 sm:px-6 sm:pt-16">
          <Link href="/work/escrow/" className="label inline-flex items-center gap-1.5 hover:text-accent">
            <Arrow dir="left" />
            The case study
          </Link>

          <header className="mt-8 max-w-[640px]">
            <p className="label">Live demo · Sepolia test network</p>
            <h1 className="mt-3 text-[34px] leading-[1.08] font-semibold tracking-[-0.025em] sm:text-[44px]">Holdfast</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-muted sm:text-[18px]">
              A crypto escrow engine, live. Start a trade, and a bot takes the other side: the payment, the
              confirmations, and the release are real transactions on Ethereum&apos;s Sepolia test network, each one
              linked so you can check it.
            </p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {FACTS.map((f) => (
                <li key={f} className="figure figure-tone">
                  {f}
                </li>
              ))}
            </ul>
          </header>

          <div className="mt-10">
            <Playground />
          </div>

          <p className="mt-8 max-w-[720px] text-[13.5px] leading-relaxed text-muted">
            Holdfast is the public, test-network version of an escrow system I run privately. It refuses to start on
            any network but Sepolia, and its dollar,{" "}
            <a href={TUSD_CONTRACT_URL} target="_blank" rel="noreferrer" className="hf-link">
              tUSD
            </a>
            , has no value. Read the{" "}
            <a href={HOLDFAST_REPO} target="_blank" rel="noreferrer" className="hf-link">
              source on GitHub
            </a>{" "}
            or{" "}
            <Link href="/work/escrow/" className="hf-link">
              how the production system works
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
