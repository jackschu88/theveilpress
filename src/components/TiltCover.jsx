import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "../motion";

export default function TiltCover({ src, alt, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 28 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (0.5 - py) * 14,
      ry: (px - 0.5) * 16,
    });
    setGlare({ x: px * 100, y: py * 100 });
  };

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlare({ x: 50, y: 28 });
  };

  return (
    <motion.div
      ref={ref}
      className={`cover-frame cover-glow tilt-cover ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1.15, delay: 0.12, ease: easeOut }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: reduce ? undefined : "transform 0.12s ease-out",
      }}
    >
      <img src={src} alt={alt} draggable={false} />
      <div
        className="cover-glare"
        style={{
          background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.28), rgba(201,168,76,0.08) 28%, transparent 52%)`,
        }}
      />
      <div className="cover-rim" aria-hidden />
    </motion.div>
  );
}
