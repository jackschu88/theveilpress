# Cinematic Upgrade — Design

## Goal

Take The Veil Press site from "B+, nice CSS effects" to "wow, feels like a movie experience" — glossier, higher production value, genuinely cinematic — across the whole site, while keeping it a fast, accessible book-marketing site rather than a tech demo.

## Current state (baseline)

- Vite + React 19 + React Router site for "The Veil of the Square Mile."
- Dark gold/noir theme already built: fog-reveal flashlight effect, gold-dust CSS particles, curtain intro animation (`VeilIntro`), kinetic split-title, magnetic buttons, tilt cover, glass cards, shimmer buttons, video trailer hero.
- Motion stack: `framer-motion` (component-level animation, `useScroll`/`useTransform` hand-rolled parallax) + `lenis` (smooth scroll), no scroll-choreography library.
- Assets: `cover.jpg` (248K), `cover.png` (868K), `trailer.mp4` (20M) — usable but not source-quality; commerce URLs in `commerce.js` are empty (buttons show "Coming soon").
- Pages: Home, Books, SquareMile, Companion, About.

## New dependencies

- `gsap` + `ScrollTrigger` — scroll-choreographed timelines (pinning, scrubbing, staggered parallax). Free/unlicensed as of Webflow's 2025 acquisition, no cost/license concern.
- `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` — WebGL hero scene (light shafts, depth-parallax dust, bloom).
- Keep `framer-motion` (component-level micro-interactions, page transitions) and `lenis` (scroll backbone GSAP syncs against). Not replacing either.

## WebGL hero scene

A `HeroScene` component (`react-three-fiber` `<Canvas>`) absolutely-positioned behind existing hero content.

- **Volumetric light shafts** — a few soft, angled gold-gradient/noise-shader planes, slowly drifting. Replaces the flat CSS `.veil-rays` conic-gradient with actual depth.
- **Depth-of-field dust field** — a few hundred instanced particles at varying Z-depth, so mouse/scroll parallax shifts near particles more than far ones (bokeh via circular sprite + blur on distant particles). Replaces `GoldDust.jsx`'s DOM-based dots.
- **Bloom post-processing** — subtle bloom on gold highlights only, so light shafts/particle glints actually glow instead of relying on CSS `box-shadow`/`text-shadow`.
- **Mouse-reactive camera drift** — small camera offset following pointer position (a few degrees max).

This replaces `GoldDust.jsx` and reduces reliance on `.atmosphere-*`/`.fog-*` CSS layers specifically for hero sections; those layers stay as-is elsewhere.

Two variants:
- **Full** (Home): all of the above.
- **Light** (Books, SquareMile heroes): fewer particles, no pin-heavy sequence, backdrop only.
- **None** (Companion, About): text-heavy reference pages — a 3D backdrop would fight readability.

## GSAP ScrollTrigger scope

- One-time setup in `src/scroll.js`: register `ScrollTrigger`, wire it to Lenis via `scrollerProxy` so Lenis drives scroll position and ScrollTrigger reads it — no fighting over scroll ownership.
- Replace the hand-rolled `useScroll`/`useTransform` parallax in `Home.jsx` (`hero-orb` y/opacity/scale) with a GSAP timeline, extended into a multi-stage scrub (orb recedes → title settles → trailer frame rises).
- Add pinned "cinematic beat" moments: the Home "Featured" panel pins briefly while the cover does a slow push-in and copy staggers in; Books/SquareMile section headers get scrub-linked reveals instead of on/off intersection-observer fades.
- `Reveal`/`Stagger` (current IntersectionObserver + Framer Motion) stay for simple one-shot fades lower on the page and on Companion/About — GSAP is reserved for moments meant to feel directed, not applied to every element.

## Asset / typography / polish pass

- **Grain** — replace the static SVG-turbulence `.atmosphere-grain` with a small animated canvas grain (cheap per-frame noise redraw) for a real film-grain read instead of a fixed dither pattern.
- **Custom cursor** — minimal gold ring/dot cursor, scales/glows on hover over interactive elements; disabled on `pointer: coarse` (touch).
- **Typography** — keep the existing Cinzel/Cormorant/Source Sans pairing; tighten `clamp()` scales at more breakpoints, fix orphan/widow risk in headlines, nudge letter-spacing on eyebrow/UI labels.
- **Asset quality** — check for higher-res originals of `cover.jpg`/`trailer.mp4` before re-export. If none exist, flag it rather than upscale-fake it (fake upscaling looks worse, not more "8K").

## Performance & accessibility safeguards

- **`prefers-reduced-motion`** — WebGL hero renders a single static frame (no animation loop); GSAP timelines collapse to instant end-states. Matches the existing reduced-motion block that already disables `VeilIntro` and hover transforms.
- **Device/perf gating** — rough capability check (`navigator.hardwareConcurrency`/`devicePixelRatio` heuristics, or a dropped-frame probe) falls back to the current CSS-only atmosphere instead of mounting the WebGL canvas, protecting low-end/older devices.
- **Mobile** — particle count/shaft complexity scale down at narrow viewports; mouse-camera-drift skipped on touch (no pointer to react to).
- **Lazy mount** — Three.js stack (~600KB+ gzipped for three/fiber/drei/postprocessing) is code-split and only loaded when the hero is in view / on mount of a page that needs it — never blocks initial paint or pages that don't use WebGL.

## Rollout plan

1. Build `HeroScene`, GSAP scroll setup (`scroll.js`), canvas grain, custom cursor against **Home** first (full treatment).
2. Compose the **light** `HeroScene` variant + GSAP scrub reveals into **Books** and **SquareMile**.
3. Apply grain + custom cursor + GSAP scrub reveals (no WebGL) to **Companion** and **About**.
4. Shared pieces are built once and composed, not rebuilt per page.

## Out of scope

- Persistent/route-spanning WebGL backdrop (considered as Approach C, rejected as overkill for a book marketing site).
- Commerce integration (empty purchase URLs are a content/business decision, not a design one).
- Upscaling existing low-res assets to fake higher resolution.
