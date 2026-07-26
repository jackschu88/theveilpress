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

  // SPA route changes manage position; don't let the browser restore mid-page.
  if (typeof history !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

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

/** Instant jump to top — used on route change so pages never open mid-scroll. */
export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else if (typeof window !== "undefined") {
    window.scrollTo(0, 0);
  }
  if (typeof document !== "undefined") {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

export function getLenis() {
  return lenisInstance;
}

export { gsap, ScrollTrigger };
