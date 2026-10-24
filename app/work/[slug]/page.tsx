import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/arrow";
import { BrawlmartDiagram } from "@/components/brawlmart-diagram";
import { EscrowDiagram } from "@/components/escrow-diagram";
import { Glyph } from "@/components/glyph";
import { OrbitDiagram } from "@/components/orbit-diagram";
import { PaymentsDiagram } from "@/components/payments-diagram";
import { PhoneGallery } from "@/components/phone-gallery";
import { type Diagram, WORK } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

const DIAGRAMS: Record<Diagram, { render: () => React.ReactNode; caption: string }> = {
  payments: {
    render: () => <PaymentsDiagram />,
    caption: "Authorization runs as a pipeline of stages; clearing and settlement run in batches.",
  },
  escrow: {
    render: () => <EscrowDiagram />,
    caption: "Every deal moves through the same steps, checked on-chain and logged.",
  },
  brawlmart: {
    render: () => <BrawlmartDiagram />,
    caption: "Two storefronts, one order flow: paid through Stripe, then delivered automatically.",
  },
  orbit: {
    render: () => <OrbitDiagram />,
    caption: "Every source flows through one pipeline into the vault; the phone app reads the vault.",
  },
};

export const dynamicParams = false;
export const generateStaticParams = () => WORK.map((w) => ({ slug: w.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = WORK.find((x) => x.slug === slug);
  return w ? { title: w.title, description: w.blurb, openGraph: { title: w.title, description: w.blurb } } : {};
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="reveal mt-12">
      <h2 className="label mb-4 flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 text-[16px] leading-relaxed text-muted">
      {items.map((p) => (
        <li key={p} className="relative pl-4 before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-2 before:bg-faint">
          {p}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const i = WORK.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();
  const w = WORK[i];
  const next = WORK[(i + 1) % WORK.length];

  return (
    <article className="case relative pt-12 sm:pt-16" style={{ "--tone": w.tone } as React.CSSProperties}>
      <div className="case-glow" aria-hidden="true" />
      <Link href="/#work" className="label inline-flex items-center gap-1.5 hover:text-accent">
        <Arrow dir="left" />
        All work
      </Link>

      <header className="reveal mt-8">
        <div className="flex items-center gap-3">
          <Glyph name={w.glyph} tone={w.tone} size={44} />
          <p className="label">
            {w.org} · {w.when}
          </p>
        </div>
        <h1 className="mt-3 text-[32px] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[42px]">{w.title}</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-muted">{w.blurb}</p>
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          <div className="bg-surface px-4 py-3.5">
            <dt className="label">Role</dt>
            <dd className="mt-1 text-[14px]">{w.role}</dd>
          </div>
          {w.figures.map((f) => (
            <div key={f} className="bg-surface px-4 py-3.5">
              <dt className="sr-only">Figure</dt>
              <dd className="tone-text text-[14px] font-medium">{f}</dd>
            </div>
          ))}
        </dl>
      </header>

      {w.demo && (
        <div className="reveal mt-8 flex flex-col gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--tone)_35%,var(--line))] bg-[var(--accent-soft)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15.5px] font-medium">Try it live</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">
              Holdfast, a public version on the Sepolia test network: run a trade against a bot, with every step a real
              transaction. No wallet needed.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href={w.demo.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              Open the demo
              <Arrow dir="right" />
            </Link>
            <a
              href={w.demo.source}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-[14px] hover:text-accent"
            >
              Source
              <Arrow className="text-faint group-hover:text-accent" />
            </a>
          </div>
        </div>
      )}

      {w.note && (
        <p className="reveal mt-8 rounded-xl border border-line bg-[var(--accent-soft)] px-4 py-3 text-[14px] leading-relaxed">
          {w.note}
        </p>
      )}

      <Block title="The problem">
        <div className="prose-case text-[16px] leading-relaxed text-muted">
          {w.problem.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Block>

      <Block title="The approach">
        <div className="prose-case text-[16px] leading-relaxed text-muted">
          {w.approach.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {w.diagram && (
          <figure className="-mx-2 mt-8 overflow-hidden rounded-2xl border border-line bg-surface px-1.5 py-4 sm:mx-0 sm:p-6">
            {DIAGRAMS[w.diagram].render()}
            <figcaption className="label mt-4 px-2.5 sm:px-0">{DIAGRAMS[w.diagram].caption}</figcaption>
          </figure>
        )}
        {w.gallery && <PhoneGallery shots={w.gallery} caption="Screens with sample data" />}
      </Block>

      <Block title="What I built">
        <Points items={w.built} />
      </Block>

      <Block title="Results">
        <Points items={w.results} />
      </Block>

      <Block title="Stack">
        <ul className="flex flex-wrap gap-1.5">
          {w.stack.map((s) => (
            <li key={s} className="figure figure-tone">
              {s}
            </li>
          ))}
        </ul>
      </Block>

      <nav className="reveal mt-16 border-t border-line pt-6" aria-label="Next case study">
        <Link href={`/work/${next.slug}/`} className="group flex items-center justify-between gap-4">
          <span>
            <span className="label">Next</span>
            <span className="mt-1 block text-[18px] font-medium group-hover:text-accent">{next.title}</span>
          </span>
          <Arrow dir="right" className="text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" />
        </Link>
      </nav>
    </article>
  );
}
