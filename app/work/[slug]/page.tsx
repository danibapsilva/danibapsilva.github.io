import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/arrow";
import { EscrowDiagram } from "@/components/escrow-diagram";
import { PaymentsDiagram } from "@/components/payments-diagram";
import { WORK } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

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
      <h2 className="label mb-4">{title}</h2>
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
    <article className="pt-12 sm:pt-16">
      <Link href="/#work" className="label inline-flex items-center gap-1.5 hover:text-accent">
        <Arrow dir="left" />
        All work
      </Link>

      <header className="reveal mt-8">
        <p className="label">
          {w.org} · {w.when}
        </p>
        <h1 className="mt-3 text-[32px] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[42px]">{w.title}</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-muted">{w.blurb}</p>
        <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-line py-5 text-[14px] sm:grid-cols-3">
          <div>
            <dt className="label">Role</dt>
            <dd className="mt-1">{w.role}</dd>
          </div>
          <div>
            <dt className="label">When</dt>
            <dd className="mt-1">{w.when}</dd>
          </div>
          <div>
            <dt className="label">Scale</dt>
            <dd className="mt-1">{w.figures[0]}</dd>
          </div>
        </dl>
      </header>

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
            {w.diagram === "payments" ? <PaymentsDiagram /> : <EscrowDiagram />}
            <figcaption className="label mt-4 px-2.5 sm:px-0">
              {w.diagram === "payments"
                ? "Authorization runs as a pipeline of stages; clearing and settlement run in batches."
                : "Every deal moves through the same steps, checked on-chain and logged."}
            </figcaption>
          </figure>
        )}
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
            <li key={s} className="figure">
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
