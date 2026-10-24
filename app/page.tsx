import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { EXPERIENCE, PERSON, SKILLS, WORK } from "@/lib/content";

const LINKS = [
  { label: "GitHub", href: PERSON.links.github },
  { label: "LinkedIn", href: PERSON.links.linkedin },
  { label: "Email", href: `mailto:${PERSON.links.email}` },
  { label: "Resume", href: PERSON.links.resume },
];

export default function Home() {
  return (
    <>
      <section className="reveal pt-16 pb-14 sm:pt-24 sm:pb-20">
        <p className="label">
          {PERSON.place} · {PERSON.degree}
        </p>
        <h1 className="mt-4 text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[52px]">
          {PERSON.name}
        </h1>
        <p className="mt-5 max-w-[34rem] text-[18px] leading-relaxed text-muted sm:text-[19px]">{PERSON.intro}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="group inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[14px] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--line))] hover:text-accent"
              >
                {l.label}
                <Arrow className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section id="work" className="scroll-mt-8 py-10">
        <h2 className="label reveal mb-6">Selected work</h2>
        <ul className="divide-y divide-line border-y border-line">
          {WORK.map((w) => (
            <li key={w.slug} className="reveal">
              <Link
                href={`/work/${w.slug}/`}
                className="group -mx-3 grid gap-2 rounded-xl px-3 py-6 transition-colors hover:bg-[var(--accent-soft)] sm:grid-cols-[5.5rem_1fr]"
              >
                <span className="label pt-1">{w.kind}</span>
                <span>
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="text-[18px] font-medium tracking-[-0.01em] group-hover:text-accent">{w.title}</span>
                    <Arrow dir="right" className="text-faint transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                  </span>
                  <span className="mt-1.5 block text-[15px] leading-relaxed text-muted">{w.blurb}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {w.figures.map((f) => (
                      <span key={f} className="figure">
                        {f}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="experience" className="scroll-mt-8 py-10">
        <h2 className="label reveal mb-6">Experience</h2>
        <ol className="space-y-10">
          {EXPERIENCE.map((j) => (
            <li key={j.org} className="reveal grid gap-2 sm:grid-cols-[4.5rem_1fr]">
              <span className="label pt-1">{j.when.split(" ").slice(-1)[0]}</span>
              <div>
                <h3 className="text-[17px] font-medium tracking-[-0.01em]">
                  {j.role}, <span className="text-muted">{j.org}</span>
                </h3>
                <p className="label mt-1">
                  {j.when} · {j.where}
                </p>
                <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-muted">
                  {j.points.map((p) => (
                    <li key={p} className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-faint">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="reveal py-10">
        <h2 className="label mb-6">Education</h2>
        <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr]">
          <span className="label pt-1">2029</span>
          <div>
            <h3 className="text-[17px] font-medium tracking-[-0.01em]">{PERSON.school}</h3>
            <p className="mt-1 text-[15px] text-muted">{PERSON.degree}</p>
          </div>
        </div>
      </section>

      <section className="reveal py-10">
        <h2 className="label mb-6">Tools I use</h2>
        <dl className="space-y-3 text-[15px]">
          {SKILLS.map((s) => (
            <div key={s.label} className="grid gap-1 sm:grid-cols-[8.5rem_1fr]">
              <dt className="text-faint">{s.label}</dt>
              <dd className="text-muted">{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
