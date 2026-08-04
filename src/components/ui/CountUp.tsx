"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

/** Compteur animé déclenché à l'entrée dans le viewport (respecte reduced-motion). */
export function CountUp({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // null tant que l'animation n'a pas démarré : on affiche alors la valeur
  // finale. Partir de 0 mettait un "0" dans le HTML rendu côté serveur, donc
  // dans ce que voient les moteurs de recherche et les moteurs génératifs.
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }
    const controls = animate(0, to, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {value ?? to}
      {suffix}
    </span>
  );
}
