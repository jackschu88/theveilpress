import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

let lenisInstance = null;

/**
 * Creates the site's single Lenis instance and syncs it with ScrollTrigger.
 * Lenis defaults to smooth-scrolling the window itself (no custom wrapper),
 * so ScrollTrigger's default document scroller stays accurate — only the
 * scroll *event* and *raf* loop need to be handed over to Lenis.
 */
export function initSmoothScroll() {
  if (lenisInstance) return () => {};

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenisInstance = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  const onTick = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(onTick);
    lenis.destroy();
    lenisInstance = null;
  };
}

export { gsap, ScrollTrigger };
