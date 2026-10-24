"use client";

import { useId, useState } from "react";
import type { Job } from "@/lib/content";

/** One role on the timeline: its strongest line always shows; the rest open on request. */
export function ExperienceItem({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const [headline, ...rest] = job.points;
  return (
    <li className="reveal relative pl-7">
      <span className="timeline-dot" aria-hidden="true" />
      <p className="label">
        {job.when} · {job.where}
      </p>
      <h3 className="mt-1.5 text-[17px] font-medium tracking-[-0.01em]">
        {job.role}, <span className="text-muted">{job.org}</span>
      </h3>
      {headline && <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{headline}</p>}
      {rest.length > 0 && (
        <>
          <div id={panel} className="disclosure" data-open={open} aria-hidden={!open}>
            <div className="disclosure-inner">
              <ul className="space-y-2 pt-2.5 text-[15px] leading-relaxed text-muted">
                {rest.map((p) => (
                  <li
                    key={p}
                    className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-faint"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panel}
            onClick={() => setOpen((o) => !o)}
            className="group mt-2 inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium text-accent hover:underline"
          >
            {open ? "Hide details" : `Show details (${rest.length} more)`}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </>
      )}
    </li>
  );
}
