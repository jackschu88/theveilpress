import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function GoldDust({ count = 28 }) {
  const reduce = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        size: 1 + (i % 4) * 0.6,
        delay: (i % 12) * 0.45,
        duration: 10 + (i % 8) * 2.2,
        opacity: 0.15 + (i % 5) * 0.08,
        drift: (i % 2 === 0 ? 1 : -1) * (12 + (i % 6) * 4),
      })),
    [count]
  );

  if (reduce) return null;

  return (
    <div className="gold-dust" aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="gold-dust-dot"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -120, -280],
            x: [0, p.drift, p.drift * 0.4],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
