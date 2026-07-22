import { useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";

// Wraps useGSAP with the prefers-reduced-motion guard every scroll-triggered
// animation in this codebase needs (matches GoldDust/FogReveal/SmoothScroll):
// skip creating any tween/ScrollTrigger when the user prefers reduced motion,
// and tear down/recreate the GSAP context if that preference changes at
// runtime. Pages call this instead of hand-rolling the guard themselves.
export function useScrollReveal(callback, { scope, dependencies = [] } = {}) {
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      if (reduce) return;
      callback();
    },
    { scope, dependencies: [reduce, ...dependencies] }
  );

  return reduce;
}
