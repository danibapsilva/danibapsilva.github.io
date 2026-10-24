"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Eases each `.reveal` section in the first time it scrolls into view (CSS does the motion). */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const items = document.querySelectorAll(".reveal:not(.in)");
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            seen.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => seen.observe(el));
    return () => seen.disconnect();
  }, [pathname]);
  return null;
}
