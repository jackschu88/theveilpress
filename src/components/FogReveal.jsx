import { useEffect, useState, useMemo } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Flashlight-through-fog layer.
 * Hidden gold messages only appear inside the mouse light cone —
 * "the fog removed" as interaction, not decoration only.
 */
const MESSAGES = [
  { text: "empire without colonies", x: 12, y: 18, size: "1.05rem", rot: -4 },
  { text: "the machine is the subject", x: 68, y: 14, size: "0.95rem", rot: 3 },
  { text: "families are episodes", x: 22, y: 42, size: "1rem", rot: -2 },
  { text: "hard to prove is not false", x: 55, y: 38, size: "0.92rem", rot: 2 },
  { text: "extraction without occupation", x: 8, y: 62, size: "1.02rem", rot: -3 },
  { text: "the map for the journey", x: 70, y: 58, size: "0.95rem", rot: 4 },
  { text: "charters older than nations", x: 35, y: 72, size: "0.9rem", rot: -1 },
  { text: "Bestial Premise", x: 75, y: 78, size: "1.1rem", rot: 2 },
  { text: "image of God", x: 15, y: 85, size: "1rem", rot: -2 },
  { text: "not a secret society", x: 48, y: 22, size: "0.88rem", rot: 1 },
  { text: "Square Mile", x: 80, y: 30, size: "1.15rem", rot: -3 },
  { text: "the high towers are real", x: 40, y: 88, size: "0.95rem", rot: 2 },
  { text: "verify it · test it", x: 60, y: 8, size: "0.85rem", rot: -1 },
  { text: "servants, not masters", x: 28, y: 28, size: "0.9rem", rot: 3 },
  { text: "locked in", x: 85, y: 48, size: "1.05rem", rot: -2 },
];

const FRAGMENTS = [
  { text: "1067", x: 5, y: 35 },
  { text: "1694", x: 92, y: 20 },
  { text: "1945", x: 88, y: 65 },
  { text: "£", x: 45, y: 55 },
  { text: "I–XV", x: 18, y: 8 },
  { text: "···", x: 50, y: 48 },
];

export default function FogReveal() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [active, setActive] = useState(false);
  const [radius, setRadius] = useState(200);

  const messages = useMemo(() => MESSAGES, []);
  const fragments = useMemo(() => FRAGMENTS, []);

  useEffect(() => {
    if (reduce) return undefined;

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setActive(true);
    };
    const onLeave = () => setActive(false);
    const onDown = () => setRadius(280);
    const onUp = () => setRadius(200);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce]);

  if (reduce) return null;

  // Soft edge so the cone feels like light in fog, not a hard cookie-cutter
  const r = radius;
  const mask = active
    ? `radial-gradient(circle ${r}px at ${pos.x}px ${pos.y}px,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,0.85) 28%,
        rgba(0,0,0,0.35) 52%,
        rgba(0,0,0,0) 72%)`
    : `radial-gradient(circle 0px at 50% 50%, transparent, transparent)`;

  return (
    <div className="fog-reveal-root" aria-hidden>
      {/* Always-on haze so the page feels veiled even without the light */}
      <div className="fog-haze" />

      {/* Revealed world — only visible inside the flashlight mask */}
      <div
        className="fog-reveal-layer"
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <div className="fog-reveal-wash" />
        <div className="fog-reveal-grid" />

        {messages.map((m) => (
          <span
            key={m.text}
            className="fog-msg"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              fontSize: m.size,
              transform: `translate(-50%, -50%) rotate(${m.rot}deg)`,
            }}
          >
            {m.text}
          </span>
        ))}

        {fragments.map((f) => (
          <span
            key={f.text + f.x}
            className="fog-frag"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            {f.text}
          </span>
        ))}

        {/* Soft beam glow at pointer — sits inside the reveal so it “lights” the text */}
        {active && (
          <div
            className="fog-beam"
            style={{
              left: pos.x,
              top: pos.y,
              width: r * 2.2,
              height: r * 2.2,
            }}
          />
        )}
      </div>

      {/* Hint — only when idle at top of session feel */}
      <div className={`fog-hint ${active ? "fog-hint-hide" : ""}`}>
        move the light through the fog
      </div>
    </div>
  );
}
