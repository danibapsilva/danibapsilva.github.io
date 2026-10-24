import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { Glyph } from "@/components/glyph";
import { SectionLabel } from "@/components/section-label";
import { SkillsMarquee } from "@/components/skills-marquee";
import { EXPERIENCE, PERSON, STATS, WORK } from "@/lib/content";

const LINKS = [
  { label: "GitHub", href: PERSON.links.github },
  { label: "LinkedIn", href: PERSON.links.linkedin },
  { label: "Email", href: `mailto:${PERSON.links.email}` },
];

export default function Home() {
  return (
    <>
      <section className="reveal pt-14 pb-12 sm:pt-20 sm:pb-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-[13px] text-muted backdrop-blur">
          <span className="status-dot" aria-hidden="true" />
          {PERSON.status}
        </p>
        <h1 className="mt-6 text-[42px] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-[58px]">
          {PERSON.name}
        </h1>
        <p className="mt-5 max-w-[36rem] text-[18px] leading-relaxed text-muted sm:text-[20px]">
          Computer science at Northeastern University. I build{" "}
          <span className="ink-gradient font-medium">systems that move money</span>: payment engines, escrow, and
          marketplaces.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <a
            href={PERSON.links.resume}
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4.5 py-2.5 text-[14px] font-medium text-bg transition-transform hover:-translate-y-0.5"
          >
            Resume
            <Arrow className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-4 py-2.5 text-[14px] backdrop-blur transition-colors hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--line))] hover:text-accent"
            >
              {l.label}
              <Arrow className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </a>
          ))}
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface px-4 py-4">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="stat block text-[26px] font-semibold tracking-[-0.03em]" style={{ "--tone": s.tone } as React.CSSProperties}>
                  {s.value}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="work" className="scroll-mt-8 py-10">
        <SectionLabel n="01">Selected work</SectionLabel>
        <ul className="grid gap-3 sm:grid-cols-2">
          {WORK.map((w) => (
            <li key={w.slug} className="reveal">
              <Link
                href={`/work/${w.slug}/`}
                className="work-card group flex h-full flex-col rounded-2xl border border-line bg-surface p-5"
                style={{ "--tone": w.tone } as React.CSSProperties}
              >
                <span className="flex items-start justify-between gap-3">
                  <Glyph name={w.glyph} tone={w.tone} />
                  <span className="flex items-center gap-1.5">
                    {w.demo && (
                      <span className="figure figure-tone inline-flex items-center gap-1.5">
                        <span className="status-dot" aria-hidden="true" />
                        Live demo
                      </span>
                    )}
                    <span className="label rounded-full border border-line px-2 py-0.5">{w.kind}</span>
                  </span>
                </span>
                <span className="mt-4 text-[17px] leading-snug font-medium tracking-[-0.01em]">{w.title}</span>
                <span className="mt-1.5 block flex-1 text-[14.5px] leading-relaxed text-muted">{w.blurb}</span>
                <span className="mt-4 flex flex-wrap gap-1.5">
                  {w.figures.slice(0, 2).map((f) => (
                    <span key={f} className="figure figure-tone">
                      {f}
                    </span>
                  ))}
                </span>
                <span className="tone-text mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium">
                  Read the case study
                  <Arrow dir="right" className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="experience" className="scroll-mt-8 py-10">
        <SectionLabel n="02">Experience</SectionLabel>
        <ol className="timeline space-y-10">
          {EXPERIENCE.map((j) => (
            <li key={j.org} className="reveal relative pl-7">
              <span className="timeline-dot" aria-hidden="true" />
              <p className="label">
                {j.when} · {j.where}
              </p>
              <h3 className="mt-1.5 text-[17px] font-medium tracking-[-0.01em]">
                {j.role}, <span className="text-muted">{j.org}</span>
              </h3>
              <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-muted">
                {j.points.map((p) => (
                  <li
                    key={p}
                    className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-faint"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
          <li className="reveal relative pl-7">
            <span className="timeline-dot" aria-hidden="true" />
            <p className="label">Expected April 2029 · Boston, MA</p>
            <h3 className="mt-1.5 text-[17px] font-medium tracking-[-0.01em]">
              B.S. Computer Science, <span className="text-muted">{PERSON.school}</span>
            </h3>
          </li>
        </ol>
      </section>

      <section className="py-10">
        <SectionLabel n="03">Tools I use</SectionLabel>
        <SkillsMarquee />
      </section>

      <section className="reveal py-10">
        <div className="contact-card rounded-3xl p-7 sm:p-9">
          <p className="label">Get in touch</p>
          <h2 className="mt-3 text-[26px] leading-tight font-semibold tracking-[-0.025em] sm:text-[30px]">
            Building something that moves money, or needs to?
          </h2>
          <p className="mt-3 max-w-[32rem] text-[15.5px] leading-relaxed text-muted">
            I&apos;m looking for a software engineering co-op from July to December 2027. I&apos;d love to hear about
            your team.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={`mailto:${PERSON.links.email}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4.5 py-2.5 text-[14px] font-medium text-bg transition-transform hover:-translate-y-0.5"
            >
              {PERSON.links.email}
            </a>
            <a
              href={PERSON.links.linkedin}
              className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2.5 text-[14px] hover:text-accent"
            >
              LinkedIn
              <Arrow className="text-faint group-hover:text-accent" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
