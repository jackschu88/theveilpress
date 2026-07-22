import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";
import LightShafts from "./LightShafts";
import DustField from "./DustField";

const VARIANTS = {
  full: { count: 220, intensity: 1 },
  light: { count: 100, intensity: 0.6 },
};

// Narrow viewports (phones) get a smaller particle count on top of whatever
// the variant already specifies — keeps the mobile hero light without
// needing a third variant tier.
function scaleForViewport(count) {
  if (typeof window === "undefined") return count;
  if (window.innerWidth < 480) return Math.round(count * 0.35);
  if (window.innerWidth < 900) return Math.round(count * 0.6);
  return count;
}

export default function HeroScene({ variant = "full" }) {
  const reduce = useReducedMotion();
  const tier = useDeviceCapability();

  if (reduce || tier === "low") return null;

  const base = VARIANTS[variant] ?? VARIANTS.full;
  const config = { ...base, count: scaleForViewport(base.count) };

  return (
    <div className="hero-scene-canvas" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: false, alpha: true }}
      >
        <Suspense fallback={null}>
          <LightShafts intensity={config.intensity} />
          <DustField count={config.count} />
        </Suspense>
      </Canvas>
    </div>
  );
}
