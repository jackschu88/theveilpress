import { useEffect, useState } from "react";

export function computeDeviceTier({ cores = 4, dpr = 1, saveData = false } = {}) {
  if (saveData) return "low";
  if (cores <= 2) return "low";
  if (cores <= 4 && dpr >= 3) return "low";
  return "high";
}

function initialTier() {
  if (typeof navigator === "undefined") return "high";
  return computeDeviceTier({
    cores: navigator.hardwareConcurrency,
    dpr: typeof window !== "undefined" ? window.devicePixelRatio : 1,
    saveData: navigator.connection?.saveData ?? false,
  });
}

/**
 * Starts from static navigator hints, then downgrades to "low" if a short
 * runtime probe sees too many dropped frames (catches devices that report
 * fine hardware specs but are actually under load/throttled).
 */
export function useDeviceCapability() {
  const [tier, setTier] = useState(initialTier);

  useEffect(() => {
    if (tier === "low") return undefined;

    let frames = 0;
    let dropped = 0;
    let last = performance.now();
    let raf;

    const tick = (now) => {
      const delta = now - last;
      last = now;
      frames += 1;
      if (delta > 32) dropped += 1;

      if (frames < 30) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (dropped / frames > 0.2) setTier("low");
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tier]);

  return tier;
}
