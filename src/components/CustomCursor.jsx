import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduce || typeof window === "undefined") {
      setEnabled(false);
      return undefined;
    }
    setEnabled(!window.matchMedia("(pointer: coarse)").matches);
    return undefined;
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return undefined;

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setActive(true);
      setHover(
        Boolean(e.target.closest?.("a, button, .btn, .card, .feature-panel"))
      );
    };
    const onLeave = () => setActive(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.body.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.body.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled || !active) return null;

  return (
    <div
      className={`custom-cursor${hover ? " custom-cursor-hover" : ""}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      aria-hidden
    />
  );
}
