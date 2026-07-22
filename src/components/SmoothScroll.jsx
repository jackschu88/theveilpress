import { useEffect } from "react";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "framer-motion";
import { initSmoothScroll } from "../scroll";

export default function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return undefined;
    return initSmoothScroll();
  }, [reduce]);

  return null;
}
