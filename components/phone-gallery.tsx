import type { Shot } from "@/lib/content";

/** Screenshots in phone frames: a row on wide screens, a swipeable strip that snaps on phones. */
export function PhoneGallery({ shots, caption }: { shots: Shot[]; caption: string }) {
  return (
    <figure className="mt-8">
      <ul className="phone-strip -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0">
        {shots.map((s) => (
          <li key={s.src} className="w-[62%] shrink-0 snap-center sm:w-auto">
            <div className="phone-frame">
              {/* eslint-disable-next-line @next/next/no-img-element -- a static export serves plain files */}
              <img src={s.src} alt={s.alt} width={s.width} height={s.height} loading="lazy" decoding="async" />
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="label mt-3">{caption}</figcaption>
    </figure>
  );
}
