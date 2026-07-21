import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Global soft spotlight that follows the pointer */
export default function Spotlight() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 50, y: 28 });

  useEffect(() => {
    if (reduce) return undefined;
    const onMove = (e) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  if (reduce) return null;

  return (
    <div
      className="spotlight"
      aria-hidden
      style={{
        background: `radial-gradient(640px circle at ${pos.x}% ${pos.y}%, rgba(201,168,76,0.13), transparent 42%)`,
      }}
    />
  );
}
