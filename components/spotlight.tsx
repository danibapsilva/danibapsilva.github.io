"use client";

import { useEffect } from "react";

/** A soft light in each work card's color that follows the pointer (CSS draws it from --mx and --my). */
export function Spotlight() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".work-card");
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - box.left}px`);
      card.style.setProperty("--my", `${e.clientY - box.top}px`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, []);
  return null;
}
