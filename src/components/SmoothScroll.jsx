import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "framer-motion";

export default function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return undefined;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
