import { PERSON } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mx-auto mt-24 w-full max-w-[720px] px-5 pb-12 sm:px-6">
      <div className="flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {PERSON.name}, {PERSON.place}
        </p>
        <p className="flex gap-4">
          <a href={PERSON.links.github} className="hover:text-ink">
            GitHub
          </a>
          <a href={PERSON.links.linkedin} className="hover:text-ink">
            LinkedIn
          </a>
          <a href={`mailto:${PERSON.links.email}`} className="hover:text-ink">
            Email
          </a>
        </p>
      </div>
    </footer>
  );
}
