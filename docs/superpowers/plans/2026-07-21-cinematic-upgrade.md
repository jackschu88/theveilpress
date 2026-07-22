# Cinematic Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade The Veil Press site (`theveilpress`) from its current CSS/Framer-Motion cinematic effects to a genuinely "wow" tier: a WebGL hero scene (volumetric light + depth-parallax dust + bloom), GSAP ScrollTrigger-choreographed scroll moments, film grain, a custom cursor, and graceful fallbacks for reduced-motion and low-end devices.

**Architecture:** A lazy-loaded `HeroScene` (react-three-fiber) renders behind hero sections on Home/SquareMile/Books only, gated by `prefers-reduced-motion` and a device-capability heuristic — it never blocks initial paint and falls back to the site's existing CSS atmosphere (fog/gold-dust/rays) when unavailable. A single `src/scroll.js` module wires GSAP's `ScrollTrigger` to the existing Lenis smooth-scroll instance; pages use `useGSAP` + `ScrollTrigger` for a small number of directed scroll moments, while the existing `Reveal`/`Stagger` (Framer Motion + IntersectionObserver) components keep handling simple one-shot fades. Canvas-based grain and a custom cursor are mounted once, globally, in `Layout.jsx`.

**Tech Stack:** React 19, Vite 8, `gsap` + `@gsap/react` + `ScrollTrigger`, `three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`, existing `framer-motion` + `lenis`. Vitest + `@testing-library/react` + `jsdom` added for the pure-logic unit tests (no test runner currently exists in this project).

## Global Constraints

- Node 20.19.6 / npm 10.8.2 (confirmed in this environment) — no engine changes needed.
- Keep `framer-motion` and `lenis` — do not replace them; GSAP/Three.js are additive.
- Every WebGL/animation addition must render a static/no-op fallback under `prefers-reduced-motion: reduce`, matching the existing pattern in `GoldDust.jsx`, `FogReveal.jsx`, `SmoothScroll.jsx` (all use `useReducedMotion()` from `framer-motion` and return `null` or skip effects).
- The Three.js stack (`three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`, ~600KB+ gzipped) must be code-split via `React.lazy` — never a static top-level import in a page file.
- No commerce/business logic changes — `src/commerce.js` stays untouched.
- Component gating (reduced motion / device tier) uses `useReducedMotion` from `framer-motion` for motion preference — do not introduce a second reduced-motion hook.

---

### Task 1: Add dependencies and test tooling

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

**Interfaces:**
- Produces: `npm run test` script (runs `vitest run`), `vitest` configured with `environment: 'jsdom'` and `globals: true`, available for all later tasks' unit tests.

- [ ] **Step 1: Install runtime dependencies**

Run:
```bash
cd "C:\Users\JackS\OneDrive\Desktop\theveil_expanded\theveilpress"
npm install gsap@^3.15.0 @gsap/react@^2.1.2 three@^0.185.1 @react-three/fiber@^9.6.1 @react-three/drei@^10.7.7 @react-three/postprocessing@^3.0.4
```
Expected: `package.json` `dependencies` gains all six packages; no errors.

- [ ] **Step 2: Install dev/test dependencies**

Run:
```bash
npm install -D vitest@^4.1.10 @testing-library/react@^16.3.2 jsdom@^29.1.1
```
Expected: `package.json` `devDependencies` gains all three packages; no errors.

- [ ] **Step 3: Add the `test` script**

In `package.json`, `scripts`, add `"test": "vitest run"` so the block reads:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "test": "vitest run"
  },
```

- [ ] **Step 4: Wire Vitest into the Vite config**

Replace the full contents of `vite.config.js` with:

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Dedicated port so this never collides with other Vite apps (often on 5173).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 5180,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

(`vitest/config`'s `defineConfig` is a superset of Vite's — it adds the `test` key's typing/behavior; the `plugins`/`server`/`preview` blocks are unchanged from before.)

- [ ] **Step 5: Verify**

Run:
```bash
npm run test
```
Expected: Vitest starts, reports "No test files found" (no `.test.js` files exist yet) and exits cleanly — confirms wiring works before any real tests are added.

Run:
```bash
npm run build
```
Expected: build succeeds (new deps don't break the existing build since nothing imports them yet).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.js
git commit -m "chore: add GSAP/Three.js deps and Vitest test tooling"
```

---

### Task 2: Device-capability heuristic

**Files:**
- Create: `src/hooks/useDeviceCapability.js`
- Test: `src/hooks/useDeviceCapability.test.js`

**Interfaces:**
- Produces: `computeDeviceTier({ cores, dpr, saveData }) => 'high' | 'low'` (pure function), `useDeviceCapability() => 'high' | 'low'` (hook, starts from `computeDeviceTier` on `navigator`, downgrades to `'low'` if a runtime dropped-frame probe detects jank). Consumed by `HeroScene` (Task 7) to decide whether to mount the WebGL canvas.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useDeviceCapability.test.js`:

```js
import { describe, expect, it } from "vitest";
import { computeDeviceTier } from "./useDeviceCapability";

describe("computeDeviceTier", () => {
  it("returns high for a typical modern desktop", () => {
    expect(computeDeviceTier({ cores: 8, dpr: 2, saveData: false })).toBe("high");
  });

  it("returns low when the browser requests reduced data usage", () => {
    expect(computeDeviceTier({ cores: 8, dpr: 2, saveData: true })).toBe("low");
  });

  it("returns low for two or fewer CPU cores", () => {
    expect(computeDeviceTier({ cores: 2, dpr: 1, saveData: false })).toBe("low");
  });

  it("returns low for a mid core count paired with very high pixel density", () => {
    expect(computeDeviceTier({ cores: 4, dpr: 3, saveData: false })).toBe("low");
  });

  it("defaults to high when called with no arguments", () => {
    expect(computeDeviceTier()).toBe("high");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/hooks/useDeviceCapability.test.js`
Expected: FAIL — `src/hooks/useDeviceCapability.js` does not exist yet.

- [ ] **Step 3: Write the implementation**

Create `src/hooks/useDeviceCapability.js`:

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/hooks/useDeviceCapability.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDeviceCapability.js src/hooks/useDeviceCapability.test.js
git commit -m "feat: add device-capability heuristic for WebGL gating"
```

---

### Task 3: Dust field particle generator

**Files:**
- Create: `src/webgl/dustField.js`
- Test: `src/webgl/dustField.test.js`

**Interfaces:**
- Produces: `generateDustField(count, seed) => Array<{ x, y, z, size, speed, parallax }>` (pure, deterministic for a given seed). Consumed by `DustField.jsx` (Task 5).

- [ ] **Step 1: Write the failing test**

Create `src/webgl/dustField.test.js`:

```js
import { describe, expect, it } from "vitest";
import { generateDustField } from "./dustField";

describe("generateDustField", () => {
  it("returns the requested particle count", () => {
    expect(generateDustField(50, 1)).toHaveLength(50);
  });

  it("is deterministic for a given seed", () => {
    const a = generateDustField(20, 42);
    const b = generateDustField(20, 42);
    expect(a).toEqual(b);
  });

  it("produces different output for different seeds", () => {
    const a = generateDustField(20, 1);
    const b = generateDustField(20, 2);
    expect(a).not.toEqual(b);
  });

  it("keeps depth (z) within the near/far range", () => {
    const particles = generateDustField(200, 7);
    particles.forEach((p) => {
      expect(p.z).toBeLessThanOrEqual(0);
      expect(p.z).toBeGreaterThanOrEqual(-8);
    });
  });

  it("gives every particle a positive size", () => {
    const particles = generateDustField(200, 7);
    particles.forEach((p) => expect(p.size).toBeGreaterThan(0));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/webgl/dustField.test.js`
Expected: FAIL — `src/webgl/dustField.js` does not exist yet.

- [ ] **Step 3: Write the implementation**

Create `src/webgl/dustField.js`:

```js
// Deterministic PRNG (mulberry32) so a given seed always produces the same
// field — lets tests assert exact output and keeps particle layout stable
// across re-renders without needing to store it in state.
function mulberry32(seed) {
  let t = seed;
  return function () {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDustField(count, seed = 1) {
  const rand = mulberry32(seed);
  const particles = new Array(count);

  for (let i = 0; i < count; i += 1) {
    const depth = rand(); // 0 = near camera, 1 = far background
    particles[i] = {
      x: (rand() - 0.5) * 12,
      y: (rand() - 0.5) * 7,
      z: -depth * 8,
      size: 0.02 + (1 - depth) * 0.05,
      speed: 0.02 + (1 - depth) * 0.06,
      parallax: 1 - depth * 0.8,
    };
  }

  return particles;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/webgl/dustField.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/webgl/dustField.js src/webgl/dustField.test.js
git commit -m "feat: add deterministic dust-field particle generator"
```

---

### Task 4: GSAP + Lenis scroll integration

**Files:**
- Create: `src/scroll.js`
- Modify: `src/components/SmoothScroll.jsx` (full file, currently 33 lines)

**Interfaces:**
- Produces: `initSmoothScroll() => cleanupFn` (creates/wires the singleton Lenis instance to `ScrollTrigger`), re-exports `gsap` and `ScrollTrigger` (already `gsap.registerPlugin(ScrollTrigger, useGSAP)`'d). Every later page task imports `{ gsap, ScrollTrigger }` from `"../scroll"` instead of `"gsap"` directly, so the plugin registration always happens exactly once.
- Consumes: `Lenis` (existing `lenis` package), `useReducedMotion` (existing pattern from `framer-motion`, used in `SmoothScroll.jsx`).

- [ ] **Step 1: Create `src/scroll.js`**

```js
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
```

- [ ] **Step 2: Replace `src/components/SmoothScroll.jsx`**

```jsx
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
```

- [ ] **Step 3: Verify no regression**

Run:
```bash
npm run build
```
Expected: build succeeds.

Run:
```bash
npm run dev
```
Then open the printed local URL (port 5180) in a browser and scroll the Home page.
Expected: scroll still feels smooth/eased exactly as before (Lenis behavior unchanged from the reviewer's perspective — only *how* it's wired changed); no console errors mentioning `ScrollTrigger` or `Lenis`.

- [ ] **Step 4: Commit**

```bash
git add src/scroll.js src/components/SmoothScroll.jsx
git commit -m "feat: wire GSAP ScrollTrigger to the existing Lenis instance"
```

---

### Task 5: WebGL dust field component

**Files:**
- Create: `src/components/HeroScene/DustField.jsx`

**Interfaces:**
- Consumes: `generateDustField(count, seed)` from `../../webgl/dustField.js` (Task 3).
- Produces: `<DustField count={number} seed={number} />` — a react-three-fiber `<instancedMesh>`. Consumed by `HeroScene/index.jsx` (Task 7).

- [ ] **Step 1: Create the component**

```jsx
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { generateDustField } from "../../webgl/dustField";

export default function DustField({ count = 220, seed = 7 }) {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () => generateDustField(count, seed),
    [count, seed]
  );
  const { pointer } = useThree();

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      const drift = Math.sin(t * p.speed + i) * 0.15;
      dummy.position.set(
        p.x + pointer.x * p.parallax * 0.6,
        p.y + drift + pointer.y * p.parallax * 0.4,
        p.z
      );
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, particles.length]}
    >
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial
        color="#f0d78c"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
```

Note: `pointer` from `useThree()` is react-three-fiber's normalized (-1..1) pointer position, auto-updated on pointer move — this is what gives the "mouse-reactive" depth-parallax feel from the design (near/less-far particles, which have higher `parallax`, shift more than distant ones).

- [ ] **Step 2: Verify it compiles**

Run:
```bash
npm run build
```
Expected: succeeds (component isn't imported anywhere yet, but this catches syntax errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroScene/DustField.jsx
git commit -m "feat: add WebGL dust-field component"
```

---

### Task 6: WebGL light shafts component

**Files:**
- Create: `src/components/HeroScene/LightShafts.jsx`

**Interfaces:**
- Produces: `<LightShafts intensity={number} />` — a react-three-fiber `<group>` of gradient planes. Consumed by `HeroScene/index.jsx` (Task 7).

- [ ] **Step 1: Create the component**

```jsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SHAFTS = [
  { x: -2.2, rot: 0.35, scale: 1.1, speed: 0.05 },
  { x: 0.4, rot: -0.15, scale: 1.4, speed: 0.035 },
  { x: 2.6, rot: 0.5, scale: 0.9, speed: 0.06 },
];

export default function LightShafts({ intensity = 1 }) {
  const group = useRef(null);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#c9a84c",
        transparent: true,
        opacity: 0.08 * intensity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [intensity]
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((mesh, i) => {
      mesh.rotation.z = SHAFTS[i].rot + Math.sin(t * SHAFTS[i].speed) * 0.05;
    });
  });

  return (
    <group ref={group} position={[0, 1, -4]}>
      {SHAFTS.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 0, 0]}
          rotation={[0, 0, s.rot]}
          scale={s.scale}
          material={material}
        >
          <planeGeometry args={[1.4, 9]} />
        </mesh>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroScene/LightShafts.jsx
git commit -m "feat: add WebGL light-shafts component"
```

---

### Task 7: HeroScene composition (Canvas + gating)

**Files:**
- Create: `src/components/HeroScene/index.jsx`

**Interfaces:**
- Consumes: `DustField` (Task 5), `LightShafts` (Task 6), `useDeviceCapability` (Task 2), `useReducedMotion` from `framer-motion`.
- Produces: `<HeroScene variant="full" | "light" />`, default export. Renders `null` when `prefers-reduced-motion: reduce` or device tier is `"low"` — callers (Task 12-14) must always wrap it in `<Suspense fallback={null}>` since it's loaded via `React.lazy`.

- [ ] **Step 1: Create the component**

```jsx
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { useDeviceCapability } from "../../hooks/useDeviceCapability";
import LightShafts from "./LightShafts";
import DustField from "./DustField";

const VARIANTS = {
  full: { count: 220, intensity: 1, bloom: 0.9 },
  light: { count: 100, intensity: 0.6, bloom: 0.5 },
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
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={config.bloom}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
```

This is the single default export every page task lazy-imports as `const HeroScene = lazy(() => import("../components/HeroScene"))`.

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroScene/index.jsx
git commit -m "feat: compose HeroScene (light shafts + dust + bloom, gated)"
```

---

### Task 8: Canvas film-grain overlay

**Files:**
- Create: `src/components/Grain.jsx`

**Interfaces:**
- Produces: `<Grain opacity={number} />`, default export. Renders `null` under reduced motion. Consumed by `Layout.jsx` (Task 10).

- [ ] **Step 1: Create the component**

```jsx
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function Grain({ opacity = 0.05 }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reduce) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 96;
    canvas.width = size;
    canvas.height = size;

    let raf;
    let frame = 0;

    const draw = () => {
      frame += 1;
      // Redraw every other frame — grain reads as "alive" without doubling
      // the getImageData/putImageData cost every animation frame.
      if (frame % 2 === 0) {
        const imageData = ctx.createImageData(size, size);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const v = Math.random() * 255;
          imageData.data[i] = v;
          imageData.data[i + 1] = v;
          imageData.data[i + 2] = v;
          imageData.data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      className="grain-canvas"
      style={{ opacity }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Grain.jsx
git commit -m "feat: add animated canvas film-grain overlay"
```

---

### Task 9: Custom cursor

**Files:**
- Create: `src/components/CustomCursor.jsx`

**Interfaces:**
- Produces: `<CustomCursor />`, default export, no props. Renders `null` under reduced motion or `(pointer: coarse)` (touch). Consumed by `Layout.jsx` (Task 10). Adds/removes the `has-custom-cursor` class on `document.body` (used by CSS in Task 11 to hide the native cursor).

- [ ] **Step 1: Create the component**

```jsx
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/CustomCursor.jsx
git commit -m "feat: add custom cursor component"
```

---

### Task 10: Wire Grain, CustomCursor, and ScrollTrigger refresh into Layout

**Files:**
- Modify: `src/components/Layout.jsx` (full file, currently 105 lines)

**Interfaces:**
- Consumes: `Grain` (Task 8), `CustomCursor` (Task 9), `ScrollTrigger` from `../scroll` (Task 4).

- [ ] **Step 1: Replace `src/components/Layout.jsx`**

```jsx
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import VeilIntro from "./VeilIntro";
import Spotlight from "./Spotlight";
import FogReveal from "./FogReveal";
import GoldDust from "./GoldDust";
import SmoothScroll from "./SmoothScroll";
import Grain from "./Grain";
import CustomCursor from "./CustomCursor";
import { pageTransition } from "../motion";
import { ScrollTrigger } from "../scroll";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/books", label: "Books" },
  { to: "/books/square-mile", label: "Square Mile" },
  { to: "/books/square-mile/companion", label: "Companion" },
  { to: "/about", label: "About" },
];

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Route transitions change page height; give the new page a frame to
    // render before recalculating ScrollTrigger's trigger positions.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <>
      <SmoothScroll />
      <Grain />
      <CustomCursor />
      <VeilIntro />
      <Spotlight />
      <FogReveal />
      <div className="atmosphere" aria-hidden>
        <div className="atmosphere-glow" />
        <div className="atmosphere-mesh" />
        <GoldDust />
      </div>

      <header className="site-header">
        <div className="shell nav-inner">
          <NavLink to="/" className="brand">
            The Veil <span>Press</span>
          </NavLink>
          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            style={{ minHeight: "55vh" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div>
            <p className="brand" style={{ marginBottom: "0.5rem" }}>
              The Veil Press
            </p>
            <p>
              Institutional histories. The fog removed.
              <br />© {new Date().getFullYear()} Jack Schumacher
              <br />
              <a href="mailto:deepdivefile@gmail.com">deepdivefile@gmail.com</a>
            </p>
          </div>
          <div className="footer-links">
            <NavLink to="/books">Books</NavLink>
            <NavLink to="/books/square-mile/companion">Companion</NavLink>
            <NavLink to="/about">About</NavLink>
            <a
              href="https://x.com/deepdivefile"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
          </div>
        </div>
        <div className="shell" style={{ marginTop: "1.5rem" }}>
          <p className="muted" style={{ fontSize: "0.95rem", margin: 0 }}>
            Book + Companion are the foundation. Video walkthroughs and the
            reader app are in development.
          </p>
        </div>
      </footer>
    </>
  );
}
```

Note: `<div className="atmosphere-grain" />` is removed here — `Grain.jsx` (Task 8) replaces it. `GoldDust` stays exactly as-is: it remains the always-available global ambient layer and the automatic fallback wherever `HeroScene` declines to mount (reduced motion / low device tier / non-hero pages).

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Layout.jsx
git commit -m "feat: mount grain + custom cursor globally, refresh ScrollTrigger on route change"
```

---

### Task 11: CSS for HeroScene layering, grain, and cursor

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: `.hero-scene-canvas` (used by `HeroScene`, Task 7), `.grain-canvas` (used by `Grain`, Task 8), `.custom-cursor` / `.custom-cursor-hover` / `body.has-custom-cursor` (used by `CustomCursor`, Task 9).

- [ ] **Step 1: Remove the now-unused static grain rule**

In `src/index.css`, delete this block (currently lines 69-76):

```css
.atmosphere-grain {
  position: absolute;
  inset: 0;
  opacity: 0.045;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}
```

- [ ] **Step 2: Make `.hero` a positioning context for the WebGL backdrop**

Find (currently around line 732):

```css
.hero {
  padding: 1.5rem 0 2.5rem;
}
```

Replace with:

```css
.hero {
  position: relative;
  isolation: isolate;
  padding: 1.5rem 0 2.5rem;
}
```

(`.hero-trailer` and `.hero-book` already declare `position: relative;` independently, so this is additive/safe for those.)

- [ ] **Step 3: Add the new layering + grain + cursor rules**

Append to the end of `src/index.css`:

```css
/* —— WebGL hero backdrop —— */
.hero-scene-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hero-scene-canvas canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* Everything else inside a .hero section sits above the WebGL backdrop */
.hero-scene-canvas ~ * {
  position: relative;
  z-index: 1;
}

/* —— Film grain —— */
.grain-canvas {
  position: fixed;
  inset: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* —— Custom cursor —— */
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  margin: -9px 0 0 -9px;
  border-radius: 50%;
  border: 1px solid rgba(240, 215, 140, 0.7);
  box-shadow: 0 0 16px rgba(201, 168, 76, 0.35);
  pointer-events: none;
  z-index: 200;
  transition:
    width 0.2s ease,
    height 0.2s ease,
    margin 0.2s ease,
    background 0.2s ease;
}

.custom-cursor-hover {
  width: 34px;
  height: 34px;
  margin: -17px 0 0 -17px;
  background: rgba(201, 168, 76, 0.12);
}

body.has-custom-cursor,
body.has-custom-cursor a,
body.has-custom-cursor button,
body.has-custom-cursor .btn {
  cursor: none;
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: succeeds (CSS-only change, but confirms no syntax error).

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "style: add HeroScene layering, grain, and custom-cursor CSS"
```

---

### Task 12: Home page — HeroScene + GSAP hero/featured choreography

**Files:**
- Modify: `src/pages/Home.jsx` (full file, currently 219 lines)

**Interfaces:**
- Consumes: `HeroScene` (Task 7, lazy-loaded), `gsap`/`ScrollTrigger` from `../scroll` (Task 4), `useGSAP` from `@gsap/react`.

- [ ] **Step 1: Replace `src/pages/Home.jsx`**

```jsx
import { lazy, Suspense, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import SplitTitle from "../components/SplitTitle";
import { MagneticLink } from "../components/MagneticButton";
import { BuyButton } from "../components/BuyButton";
import commerce, { hasUrl } from "../commerce";
import { easeOut } from "../motion";
import { gsap, ScrollTrigger } from "../scroll";

const HeroScene = lazy(() => import("../components/HeroScene"));

export default function Home() {
  const heroRef = useRef(null);
  const orbRef = useRef(null);
  const featuredRef = useRef(null);
  const featuredImgRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const { printUrl, ebookUrl, audiobookUrl, printLabel, audiobookLabel } =
    commerce.squareMile;

  useGSAP(
    () => {
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          yPercent: 40,
          opacity: 0.15,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (featuredRef.current && featuredImgRef.current) {
        gsap.fromTo(
          featuredImgRef.current,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top bottom",
              end: "top 30%",
              scrub: true,
            },
          }
        );

        ScrollTrigger.create({
          trigger: featuredRef.current,
          start: "top 20%",
          end: "+=260",
          pin: true,
          pinSpacing: true,
        });
      }
    },
    { scope: heroRef }
  );

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted) {
      el.play().catch(() => {});
    }
  };

  return (
    <AnimatedPage>
      <section className="hero hero-trailer" ref={heroRef}>
        <Suspense fallback={null}>
          <HeroScene variant="full" />
        </Suspense>

        <div ref={orbRef} className="hero-orb" aria-hidden />

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          Volume I · The Veil Press
        </motion.p>

        <SplitTitle text="The Veil of the Square Mile" className="h1-book" />

        <motion.div
          className="title-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.55, ease: easeOut }}
        />

        <motion.p
          className="lede lede-glow hero-trailer-lede"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: easeOut }}
        >
          The invisible British financial empire — documented, not dramatized.
        </motion.p>

        <motion.div
          className="trailer-stage"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: easeOut }}
        >
          <div className="trailer-frame">
            <video
              ref={videoRef}
              className="trailer-video"
              src="/trailer.mp4"
              poster="/cover.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              controls
              aria-label="Trailer for The Veil of the Square Mile"
            />
            <button
              type="button"
              className="trailer-mute"
              onClick={toggleMute}
              aria-pressed={!muted}
              aria-label={muted ? "Unmute trailer" : "Mute trailer"}
            >
              {muted ? "Unmute" : "Mute"}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="actions actions-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.9, ease: easeOut }}
        >
          {hasUrl(printUrl) ? (
            <BuyButton href={printUrl} label={printLabel || "Buy the Book"} />
          ) : (
            <MagneticLink
              className="btn btn-primary btn-shimmer"
              to="/books/square-mile"
            >
              Buy the Book
            </MagneticLink>
          )}
          <BuyButton
            href={audiobookUrl}
            label={audiobookLabel || "Get the Audiobook"}
            className="btn btn-shimmer"
            comingSoonLabel="Audiobook · Coming soon"
          />
          {hasUrl(ebookUrl) && (
            <BuyButton
              href={ebookUrl}
              label="Buy PDF"
              className="btn"
            />
          )}
        </motion.div>
      </section>

      <Reveal>
        <hr className="rule rule-pulse" />
      </Reveal>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>Featured</h2>
          </div>
        </Reveal>
        <Reveal>
          <Link
            ref={featuredRef}
            to="/books/square-mile"
            className="feature-panel feature-wow"
          >
            <div className="feature-visual">
              <img
                ref={featuredImgRef}
                src="/cover.jpg"
                alt="The Veil of the Square Mile cover"
              />
              <div className="feature-scan" aria-hidden />
            </div>
            <div className="feature-body">
              <div className="meta" style={{ marginBottom: "0.75rem" }}>
                Volume I · Available
              </div>
              <h3>The Veil of the Square Mile</h3>
              <p>
                The City of London Corporation and the invisible financial empire
                — architecture on the record, not melodrama.
              </p>
              <span
                className="btn btn-primary btn-shimmer"
                style={{ alignSelf: "flex-start" }}
              >
                Enter the volume
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>How the house works</h2>
          </div>
        </Reveal>
        <Stagger className="card-grid three">
          {[
            { n: "01", t: "The book", d: "Continuous argument — the journey." },
            {
              n: "02",
              t: "The Companion",
              d: "Sources, trees, bibliography — the map.",
            },
            {
              n: "03",
              t: "The library",
              d: "Reader apparatus for every Veil title.",
            },
          ].map((c) => (
            <StaggerItem key={c.n}>
              <div className="card card-lift card-glow">
                <div className="meta">{c.n}</div>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal className="section">
        <div
          className="card soon card-glow"
          style={{ textAlign: "center", padding: "2.4rem" }}
        >
          <div className="meta">Further volumes</div>
          <h3 style={{ marginBottom: "0.5rem" }}>More under The Veil</h3>
          <p style={{ margin: "0 auto", maxWidth: "28rem" }}>
            Additional institutional histories will appear on the shelf as they
            release — same imprint, same evidentiary spine.
          </p>
        </div>
      </Reveal>
    </AnimatedPage>
  );
}
```

Key changes from the original: `hero-orb` is now a plain `div` driven by a GSAP scrub timeline (`useGSAP`) instead of `framer-motion`'s `useScroll`/`useTransform`; `HeroScene` renders behind the hero content via `.hero-scene-canvas` (Task 11 makes `.hero` `position: relative` so this backdrop is contained); the Featured panel's cover image gets a scrub-linked scale-down (1.08 → 1) and the panel briefly pins (`+=260`px of scroll) as a directed "beat." `react-router-dom`'s `Link` forwards `ref` to the underlying `<a>`, so `featuredRef` resolves to a real DOM node for `ScrollTrigger`.

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, open the site, go to Home (`/`).

Check:
- No console errors.
- A soft gold-lit WebGL backdrop (light shafts + drifting dust) is visible behind the hero title/trailer, and dust particles shift slightly as the mouse moves.
- Scrolling down: the orb recedes/fades smoothly (scrubbed, not stepped); when the "Featured" panel reaches ~20% from the top, the page briefly holds (pins) while the cover image settles from slightly-zoomed to normal size, then scrolling continues normally.
- Toggle OS/browser "reduce motion" (or `prefers-reduced-motion: reduce` in DevTools rendering tab) and reload: the WebGL backdrop does not mount, the orb/featured-panel scrub/pin do not run (GSAP still creates the tween but it has nothing meaningful to scrub against once ScrollTrigger effectively no-ops — the important check is that nothing errors and the page is fully usable/static-looking), and the rest of the page behaves as it did before this task.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: add HeroScene + GSAP scroll choreography to Home"
```

---

### Task 13: SquareMile page — light HeroScene + argument-card scrub

**Files:**
- Modify: `src/pages/SquareMile.jsx` (full file, currently 214 lines)

**Interfaces:**
- Consumes: `HeroScene` (Task 7, lazy `variant="light"`), `gsap` from `../scroll`, `useGSAP` from `@gsap/react`.

- [ ] **Step 1: Replace `src/pages/SquareMile.jsx`**

```jsx
import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGSAP } from "@gsap/react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import TiltCover from "../components/TiltCover";
import SplitTitle from "../components/SplitTitle";
import { MagneticLink, MagneticAnchor } from "../components/MagneticButton";
import { BuyButton } from "../components/BuyButton";
import commerce, { hasUrl } from "../commerce";
import { easeOut } from "../motion";
import { gsap } from "../scroll";

const HeroScene = lazy(() => import("../components/HeroScene"));

export default function SquareMile() {
  const heroRef = useRef(null);
  const argumentRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useGSAP(
    () => {
      if (!argumentRef.current) return;
      gsap.fromTo(
        argumentRef.current,
        { opacity: 0, scale: 0.94, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: argumentRef.current,
            start: "top 88%",
            end: "top 55%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: argumentRef }
  );

  const { printUrl, ebookUrl, printLabel, ebookLabel } = commerce.squareMile;
  const printReady = hasUrl(printUrl);
  const ebookReady = hasUrl(ebookUrl);

  return (
    <AnimatedPage>
      <section className="hero hero-grid hero-book" ref={heroRef}>
        <Suspense fallback={null}>
          <HeroScene variant="light" />
        </Suspense>
        <motion.div className="book-hero-glow" style={{ y: bgY }} aria-hidden />
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: easeOut }}
          >
            Volume I · The Veil Press
          </motion.p>

          <SplitTitle text="The Veil of the Square Mile" className="h1-book" />

          <motion.div
            className="title-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.85, ease: easeOut }}
          />

          <motion.p
            className="lede lede-glow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: easeOut }}
          >
            The invisible British financial empire — documented, not dramatized.
          </motion.p>

          <motion.p
            className="muted author-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Jack Schumacher
          </motion.p>

          <motion.div
            className="actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7, ease: easeOut }}
          >
            {printReady || ebookReady ? (
              <>
                {printReady && (
                  <BuyButton href={printUrl} label={printLabel} />
                )}
                {ebookReady && (
                  <BuyButton
                    href={ebookUrl}
                    label={ebookLabel}
                    className="btn btn-shimmer"
                  />
                )}
              </>
            ) : (
              <MagneticAnchor
                className="btn btn-primary btn-shimmer"
                href="#buy"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("buy")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get the book
              </MagneticAnchor>
            )}
            <MagneticLink className="btn" to="/books/square-mile/companion">
              Companion Guide
            </MagneticLink>
          </motion.div>
        </div>

        <TiltCover
          src="/cover.jpg"
          alt="Cover of The Veil of the Square Mile — hand drawing a curtain on the City of London skyline"
        />
      </section>

      <Reveal>
        <hr className="rule rule-pulse" />
      </Reveal>

      <div ref={argumentRef} className="section">
        <div className="card card-glow argument-card">
          <div className="meta">The argument</div>
          <p className="argument-lead">
            For centuries, the City of London Corporation has been among the most
            durable institutional settings in which the large decisions of the
            modern world have been prepared, financed, and locked in.
          </p>
          <p className="muted" style={{ marginBottom: 0, fontSize: "1.12rem" }}>
            Fifteen parts. Foundations to the digital veil. Not cabals — a
            corporate order and a premise about what a human being is.
          </p>
        </div>
      </div>

      <section className="section" id="buy">
        <Reveal>
          <div className="section-head">
            <h2>Get the book</h2>
          </div>
        </Reveal>
        <Stagger className="price-row">
          <StaggerItem className="price-card price-glow">
            <div className="meta">Print</div>
            <strong>{printReady ? "Order" : "Coming soon"}</strong>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              Trade paperback via Amazon KDP and bookstore channels (IngramSpark).
            </p>
            <BuyButton
              href={printUrl}
              label={printLabel}
              comingSoonLabel="Link pending"
              className="btn btn-primary btn-shimmer"
            />
          </StaggerItem>
          <StaggerItem className="price-card price-glow">
            <div className="meta">PDF / ebook</div>
            <strong>{ebookReady ? "Download" : "Coming soon"}</strong>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              Direct from The Veil Press. Buyers get Companion access at $5.99.
            </p>
            <BuyButton
              href={ebookUrl}
              label={ebookLabel}
              comingSoonLabel="Link pending"
              className="btn btn-primary btn-shimmer"
            />
          </StaggerItem>
        </Stagger>

        {!printReady && !ebookReady && (
          <Reveal delay={0.1}>
            <div className="commerce-placeholder">
              <strong style={{ color: "var(--ink)" }}>How to connect checkout</strong>
              <br />
              1. Create products on Amazon (print) and Gumroad/Lemon (PDF).
              <br />
              2. Paste URLs into{" "}
              <code>src/commerce.js</code> → <code>squareMile.printUrl</code> /{" "}
              <code>ebookUrl</code>.
              <br />
              3. Redeploy. Buttons go live automatically.
            </div>
          </Reveal>
        )}
      </section>

      <section className="section">
        <Stagger className="card-grid two">
          <StaggerItem>
            <Link
              className="card card-lift card-glow"
              to="/books/square-mile/companion"
            >
              <div className="meta">Apparatus</div>
              <h3>Companion Guide</h3>
              <p>
                The map: glossary, timelines, dynastic trees, bibliography,
                steelman. Not a second narrative book.
              </p>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">For print buyers</div>
              <h3>QR path</h3>
              <p>
                Scan the code in the book, or open{" "}
                <code style={{ color: "var(--gold-dim)" }}>
                  theveilpress.com/books/square-mile/companion/print
                </code>{" "}
                for the book-buyer price.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </section>
    </AnimatedPage>
  );
}
```

Key changes: `HeroScene variant="light"` behind the hero; the `argument-card` section's `<Reveal className="section">` wrapper is replaced with a plain `<div ref={argumentRef} className="section">` — GSAP now owns that reveal (a scale+opacity scrub as it enters the viewport) instead of the IntersectionObserver-based `Reveal`, avoiding two systems animating the same element.

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, go to `/books/square-mile`.

Check: lighter WebGL backdrop visible behind the hero (fewer/subtler particles than Home); scrolling down, the argument card scales/fades in smoothly tied to scroll position (not an instant snap); no console errors; reduced-motion still works (WebGL backdrop absent, page fully readable).

- [ ] **Step 3: Commit**

```bash
git add src/pages/SquareMile.jsx
git commit -m "feat: add light HeroScene + argument-card scrub to SquareMile"
```

---

### Task 14: Books page — light HeroScene + catalogue scrub

**Files:**
- Modify: `src/pages/Books.jsx` (full file, currently 71 lines)

**Interfaces:**
- Consumes: `HeroScene` (Task 7, lazy `variant="light"`), `gsap` from `../scroll`, `useGSAP` from `@gsap/react`.

- [ ] **Step 1: Replace `src/pages/Books.jsx`**

```jsx
import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal } from "../components/Reveal";
import { gsap } from "../scroll";

const HeroScene = lazy(() => import("../components/HeroScene"));

export default function Books() {
  const heroRef = useRef(null);
  const listRef = useRef(null);

  useGSAP(
    () => {
      if (!listRef.current) return;
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 88%",
            end: "top 60%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: listRef }
  );

  return (
    <AnimatedPage>
      <div className="hero" ref={heroRef}>
        <Suspense fallback={null}>
          <HeroScene variant="light" />
        </Suspense>
        <Reveal>
          <p className="eyebrow">Catalogue</p>
          <h1>Books</h1>
          <p className="lede">
            Titles from The Veil Press. Each volume stands alone; the series shares
            a standard: institutions on the record, not cabals in the shadows.
          </p>
        </Reveal>
      </div>

      <Reveal>
        <hr className="rule" />
      </Reveal>

      <div ref={listRef}>
        <ul className="list-clean list-animated">
          <li>
            <div>
              <div className="meta" style={{ marginBottom: "0.35rem" }}>
                Volume I
              </div>
              <Link
                to="/books/square-mile"
                className="label"
                style={{ fontSize: "1.25rem" }}
              >
                The Veil of the Square Mile
              </Link>
              <p
                className="muted"
                style={{ margin: "0.4rem 0 0", maxWidth: "36rem" }}
              >
                A comprehensive analysis of the invisible British financial
                empire.
              </p>
            </div>
            <span className="value">Available</span>
          </li>
          <li className="soon">
            <div>
              <div className="meta" style={{ marginBottom: "0.35rem" }}>
                Further volumes
              </div>
              <span
                className="label"
                style={{ fontSize: "1.25rem", color: "var(--ink-muted)" }}
              >
                Forthcoming titles under The Veil
              </span>
              <p
                className="muted"
                style={{ margin: "0.4rem 0 0", maxWidth: "36rem" }}
              >
                New institutional histories will appear here as they are
                released.
              </p>
            </div>
            <span className="value">Soon</span>
          </li>
        </ul>
      </div>
    </AnimatedPage>
  );
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, go to `/books`.

Check: light WebGL backdrop behind the catalogue intro text; scrolling, the list fades/slides in smoothly as it crosses ~88%→60% of the viewport; no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Books.jsx
git commit -m "feat: add light HeroScene + catalogue scrub to Books"
```

---

### Task 15: Companion page — note-box scrub

**Files:**
- Modify: `src/pages/Companion.jsx` (full file, currently 187 lines)

**Interfaces:**
- Consumes: `gsap` from `../scroll`, `useGSAP` from `@gsap/react`. No `HeroScene` — Companion is text/reference-heavy (per design, WebGL would fight readability here).

- [ ] **Step 1: Add the `useRef`/`useGSAP` import and hook, and wrap the note-box**

In `src/pages/Companion.jsx`, change the import block (lines 1-5) from:

```jsx
import { Link, useLocation } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { BuyButton } from "../components/BuyButton";
import commerce, { hasUrl } from "../commerce";
```

to:

```jsx
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { BuyButton } from "../components/BuyButton";
import commerce, { hasUrl } from "../commerce";
import { gsap } from "../scroll";
```

Then, right after the `export default function Companion() {` line, add the ref and hook (before the existing `const { pathname } = useLocation();` line):

```jsx
export default function Companion() {
  const noteRef = useRef(null);

  useGSAP(
    () => {
      if (!noteRef.current) return;
      gsap.fromTo(
        noteRef.current,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: noteRef.current,
            start: "top 88%",
            end: "top 60%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: noteRef }
  );

  const { pathname } = useLocation();
```

Then find the "What this is not" block (originally lines 65-81):

```jsx
      <Reveal className="section">
        <div className="note-box">
          <strong
            style={{
              color: "var(--gold)",
              display: "block",
              marginBottom: "0.35rem",
            }}
          >
            What this is not
          </strong>
          A second narrative book, a sequel chapter, or a rewrite of the main
          text. You do not need it to follow the argument. You will want it if
          you intend to verify claims, follow genealogies, or work from the
          primary trail.
        </div>
      </Reveal>
```

Replace with:

```jsx
      <div ref={noteRef} className="section">
        <div className="note-box">
          <strong
            style={{
              color: "var(--gold)",
              display: "block",
              marginBottom: "0.35rem",
            }}
          >
            What this is not
          </strong>
          A second narrative book, a sequel chapter, or a rewrite of the main
          text. You do not need it to follow the argument. You will want it if
          you intend to verify claims, follow genealogies, or work from the
          primary trail.
        </div>
      </div>
```

All other content in the file (the rest of the JSX, the `items` array, the pricing/access section, etc.) stays exactly as it was.

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, go to `/books/square-mile/companion`.

Check: the "What this is not" box slides in from the left, tied to scroll position, instead of snapping in on intersection; rest of the page (pricing cards, list) behaves as before; no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Companion.jsx
git commit -m "feat: add GSAP scrub reveal to Companion note-box"
```

---

### Task 16: About page — prose scrub

**Files:**
- Modify: `src/pages/About.jsx` (full file, currently 75 lines)

**Interfaces:**
- Consumes: `gsap` from `../scroll`, `useGSAP` from `@gsap/react`.

- [ ] **Step 1: Replace `src/pages/About.jsx`**

```jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal } from "../components/Reveal";
import { gsap } from "../scroll";

export default function About() {
  const proseRef = useRef(null);

  useGSAP(
    () => {
      if (!proseRef.current) return;
      gsap.fromTo(
        proseRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: proseRef.current,
            start: "top 88%",
            end: "top 60%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: proseRef }
  );

  return (
    <AnimatedPage>
      <Reveal>
        <p className="eyebrow">Imprint</p>
        <h1>About The Veil Press</h1>
        <p className="lede" style={{ maxWidth: "36rem" }}>
          The Veil Press publishes institutional histories — careful maps of how
          power is organized, financed, and made durable.
        </p>
      </Reveal>

      <Reveal>
        <hr className="rule" />
      </Reveal>

      <div ref={proseRef} className="prose">
        <h2>The series</h2>
        <p>
          Each volume under The Veil examines a load-bearing piece of the modern
          order: money, law, narrative, enforcement. The first title is{" "}
          <em>The Veil of the Square Mile</em>. Further volumes will follow under
          the same imprint and the same standard of evidence.
        </p>

        <h2>The author</h2>
        <p>
          Jack Schumacher writes institutional history for readers who want the
          record, not the melodrama. Claims are owned in the first person;
          incompleteness is stated when the evidence runs out.
        </p>

        <h2>Contact</h2>
        <p className="muted">
          Press and inquiries:{" "}
          <a href="mailto:deepdivefile@gmail.com">deepdivefile@gmail.com</a>
        </p>
        <p className="muted">
          On X:{" "}
          <a
            href="https://x.com/deepdivefile"
            target="_blank"
            rel="noopener noreferrer"
          >
            @deepdivefile
          </a>
        </p>
      </div>

      <Reveal>
        <div className="actions">
          <Link className="btn btn-primary" to="/books/square-mile">
            The Veil of the Square Mile
          </Link>
          <a
            className="btn"
            href="https://x.com/deepdivefile"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on X
          </a>
          <Link className="btn" to="/books">
            All books
          </Link>
        </div>
      </Reveal>
    </AnimatedPage>
  );
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, go to `/about`.

Check: the series/author/contact prose block fades/slides in tied to scroll; no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/About.jsx
git commit -m "feat: add GSAP scrub reveal to About prose block"
```

---

### Task 17: Typography polish — orphan/widow control

**Files:**
- Modify: `src/index.css`

**Interfaces:** none (CSS-only, no component/JS interface).

- [ ] **Step 1: Prevent ragged/orphan headline wraps**

Find the combined heading rule (currently around lines 578-586):

```css
h1,
h2,
h3 {
  font-family: Cinzel, "Times New Roman", serif;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.2;
  margin: 0 0 0.85rem;
}
```

Add `text-wrap: balance;` so multi-line headlines (e.g. `SplitTitle`'s "The Veil of the Square Mile" at narrow widths) distribute words evenly across lines instead of leaving a short orphan line:

```css
h1,
h2,
h3 {
  font-family: Cinzel, "Times New Roman", serif;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.2;
  margin: 0 0 0.85rem;
  text-wrap: balance;
}
```

- [ ] **Step 2: Prevent orphan last-lines in body copy**

Find the `.lede` rule (currently around lines 759-765):

```css
.lede {
  font-size: clamp(1.2rem, 2.2vw, 1.4rem);
  color: var(--ink-muted);
  max-width: 34rem;
  line-height: 1.7;
  font-weight: 400;
}
```

Add `text-wrap: pretty;`:

```css
.lede {
  font-size: clamp(1.2rem, 2.2vw, 1.4rem);
  color: var(--ink-muted);
  max-width: 34rem;
  line-height: 1.7;
  font-weight: 400;
  text-wrap: pretty;
}
```

Find the `.prose p` rule (currently around lines 646-650):

```css
.prose p {
  font-size: 1.2rem;
  line-height: 1.75;
  color: rgba(240, 235, 224, 0.88);
}
```

Add `text-wrap: pretty;`:

```css
.prose p {
  font-size: 1.2rem;
  line-height: 1.75;
  color: rgba(240, 235, 224, 0.88);
  text-wrap: pretty;
}
```

(`text-wrap: balance`/`pretty` are supported in current Chromium/Firefox/Safari; unsupported browsers simply ignore the declaration and fall back to normal wrapping — no fallback code needed.)

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: succeeds.

Run: `npm run dev`, open Home and About at a narrow viewport (~380px wide, e.g. DevTools device toolbar).
Expected: the hero title and prose paragraphs no longer leave a single short/orphan word alone on the last line.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: balance headline wraps and prevent orphan lines"
```

---

### Task 18: Source asset quality check

**Files:** none created/modified — investigation only, reported to the user.

The design spec requires checking for higher-resolution originals of `public/cover.jpg`/`public/cover.png`/`public/trailer.mp4` before treating them as final, and explicitly forbids upscale-faking if no better source exists (upscaling would look worse, not more "8K").

- [ ] **Step 1: Check current asset dimensions**

Run:
```bash
cd "C:\Users\JackS\OneDrive\Desktop\theveil_expanded\theveilpress"
node -e "const s=require('fs').statSync('public/cover.jpg'); console.log('cover.jpg', s.size, 'bytes')"
```

Open `public/cover.jpg`, `public/cover.png`, and `public/trailer.mp4` directly (e.g. via the Read tool or an image viewer) and note their pixel dimensions.

- [ ] **Step 2: Search likely source locations for higher-resolution originals**

Run:
```bash
find "C:\Users\JackS\OneDrive\Desktop\theveil_expanded" -iname "*cover*" -not -path "*/node_modules/*"
find "C:\Users\JackS\OneDrive\Desktop" -maxdepth 3 -iname "*veil*" -not -path "*theveilpress*"
```

Check whether any match is a larger/higher-resolution version of the current `cover.jpg`/`cover.png` (e.g. a print-resolution book-cover export, or the original video render before compression) than what's currently in `public/`.

- [ ] **Step 3: Act on what's found**

- If a genuinely higher-resolution source is found: re-export it to `public/cover.jpg` (compressed for web, but starting from the higher-res source) and/or replace `public/trailer.mp4`, matching the existing filenames so no code changes are needed. Re-run `npm run build` and visually confirm the image/video still displays correctly on Home and SquareMile.
- If no higher-resolution source exists: do **not** upscale the existing files (AI upscaling or simple interpolation would introduce artifacts and look worse under the new bloom/grain treatment, not better). Instead, report this to the user directly: which assets are capped at their current resolution, and that a proper reshoot/re-render or professional upscale would be needed to go further.

- [ ] **Step 4: Commit (only if assets were replaced)**

```bash
git add public/cover.jpg public/cover.png public/trailer.mp4
git commit -m "chore: replace hero assets with higher-resolution sources"
```

If nothing was replaced, skip the commit — there's nothing to check in.

---

### Task 19: Full-site verification pass

**Files:** none (verification only).

- [ ] **Step 1: Automated checks**

Run:
```bash
npm run test
```
Expected: PASS — 10 tests total (`computeDeviceTier` × 5, `generateDustField` × 5).

Run:
```bash
npm run build
```
Expected: succeeds with no errors. Check the build output for a separate chunk containing `three`/`@react-three` — confirms the WebGL stack is code-split, not bundled into the main entry.

Run:
```bash
npm run lint
```
Expected: no new lint errors introduced by this work (existing `oxlint` baseline, if any, is unaffected by these files).

- [ ] **Step 2: Manual verification, normal motion**

Run: `npm run dev`, open the site with DevTools console visible.

Walk every route: `/`, `/books`, `/books/square-mile`, `/books/square-mile/companion`, `/about`.

Check on each:
- No console errors or warnings mentioning `THREE`, `WebGL`, `ScrollTrigger`, or `Lenis`.
- Film grain is subtly visible site-wide (a faint animated texture, not static).
- Custom gold-ring cursor replaces the system cursor and enlarges over links/buttons/cards.
- Home/SquareMile/Books show the WebGL backdrop (Home fullest, SquareMile/Books lighter); Companion/About do not.
- The GSAP-driven moments (Home orb + Featured pin, SquareMile argument-card, Books catalogue, Companion note-box, About prose) all animate smoothly tied to scroll speed — not instant snaps, not stuttering.
- Route transitions (clicking nav links) still show the existing blur/fade page transition, and scroll-triggered elements on the new page still fire correctly (confirms the `ScrollTrigger.refresh()` on route change, Task 10, is working).

- [ ] **Step 3: Manual verification, reduced motion**

Enable "reduce motion" (Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce", or OS-level setting) and reload each route.

Check: no WebGL canvas mounts anywhere; grain overlay is absent; custom cursor is absent (native cursor shows); `VeilIntro` curtain animation is skipped (pre-existing behavior); page content is fully readable and navigable; no console errors.

- [ ] **Step 4: Manual verification, low-end device simulation**

In Chrome DevTools → Performance tab, enable "CPU: 6x slowdown", then reload Home with motion NOT reduced.

Check: either the WebGL backdrop doesn't mount at all (if `useDeviceCapability`'s dropped-frame probe catches the throttling within its ~30-frame sampling window), or if it does mount, the rest of the page (scrolling, buttons, nav) stays responsive — confirms the WebGL layer isn't blocking the main thread badly enough to make the site feel broken even in the worst case.

- [ ] **Step 5: Report findings**

If any check in Steps 2-4 fails, fix it before considering this plan complete — do not proceed to a "done" summary with a known-broken check. Once all checks pass, the cinematic upgrade is complete.
