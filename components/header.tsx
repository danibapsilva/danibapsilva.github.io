import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PERSON } from "@/lib/content";

export function Header() {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="mx-auto flex w-full max-w-[720px] items-center justify-between px-5 py-3 sm:px-6 sm:py-4">
      <Link href="/" className="flex items-center gap-2.5 rounded-md font-medium" aria-label={`${PERSON.name}, home`}>
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-line font-mono text-[12px] font-semibold tracking-tight">
          DS
        </span>
        <span className="hidden text-[15px] sm:inline">{PERSON.name}</span>
      </Link>
      <nav className="flex items-center gap-1 text-[14px] text-muted" aria-label="Main">
        <Link href="/#work" className="rounded-md px-2.5 py-1.5 transition-colors hover:text-ink">
          Work
        </Link>
        <Link href="/#experience" className="rounded-md px-2.5 py-1.5 transition-colors hover:text-ink">
          Experience
        </Link>
        <a href={PERSON.links.resume} className="rounded-md px-2.5 py-1.5 transition-colors hover:text-ink">
          Resume
        </a>
        <ThemeToggle />
      </nav>
      </div>
    </header>
  );
}
