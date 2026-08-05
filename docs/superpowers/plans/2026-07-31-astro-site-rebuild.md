# Veil Press Site Rebuild — Astro Implementation Plan
## Website side (theveilpress). Bezalel emits; the site projects.

**Date:** 2026-07-31  
**Status:** Plan — corrected against repo + `grokwebsitebuild.txt` consensus (Grok IA + DeepSeek stack/moat + visual system + customer-facing AI). Awaiting go on Phase A.  
**Repo:** `C:\Users\JackS\OneDrive\Desktop\theveil_expanded\theveilpress`  
**Visual system:** `docs/VEILPRESS_VISUAL_SYSTEM.md` (v0.1, binding)  
**Handoff:** `HANDOFF.md` (hard rules still apply)  
**Partner build:** Bezalel (atlas-studio) writes Canonical Packages to this repo. This plan consumes that contract.

---

# Cutover policy (LOCKED)

**Build the Astro press on disk in the background. Do not push or deploy it as the live site until the rebuild is complete and you explicitly greenlight cutover.**

| Do | Do not |
|----|--------|
| Work on a **branch** and/or **git worktree** (or parallel folder) so main/live stays the current Vite SPA | Force-push or merge to the production-tracking branch without a cutover decision |
| Local `npm run dev` / `npm run build` / preview on port 5180 | Point the production Vercel project at the incomplete Astro tree mid-rebuild |
| Commit locally (and optional private remote branch) as progress | Replace the live storefront (presale, Gumroad paths, thank-you) with a half-migrated site |
| Keep current `main`/deployed Vite site as **source of truth for the public** until cutover | Assume “build green locally” means “ship to theveilpress.com” |

**Cutover only when:** Phase A complete + Phase B desk pipe proven (or accepted stub + fixture policy) + redirects verified + commerce smoke-tested + you say go. Prefer a single switch (branch merge / Vercel production deploy of the finished build), not drip-replacing production routes.

**Implication for implementers:** treat production deploy, `vercel --prod`, production domain DNS, and merging into whatever branch currently deploys the live site as **explicit user-approved actions**, not default end-of-task steps.

---

# Positioning (one sentence — public face)

**The Veil Press** = independent press documenting durable power — architecture, money, narrative, access — with books as the deep layer and the desk as the continuous signal.

Not: lifestyle blog, cable clone, Gumroad storefront with articles taped on, or “AI news” feed.  
Doctrine: **one press, four surfaces, local control plane stays the brain.** Site is a **projection** of approved packages — never a second brain.

---

# 0. Where the wires meet (LOCKED — do not drift)

Bezalel's Publisher agent writes **four** artifacts on Approve (three files + index registration). The website consumes them; CI rejects anything that violates them.

| # | Artifact | Path | Consumed by |
|---|----------|------|-------------|
| 1 | Article (frontmatter + **full markdown body**) | `content/articles/{YYYY-MM-DD}-{slug}.md` | Astro Content Collection (Phase B) |
| 2 | Media assets (hero, inline images) | `public/articles/{YYYY-MM-DD}-{slug}/` | Astro `public/` → `/articles/{date}-{slug}/…` |
| 3 | Index append (Observation per article–entity link) | `data/scored-news/{jobId}.json` | `scripts/scanIndex.js` → `data/site-index.json` |
| 4 | Index article registration | append to `data/site-index.json` → `articles[]` matching `data/schema.ts` `Article` | scan integrity + entity pages |

**Body of record:** full markdown from Bezalel’s existing write → NCI critic → polish → **human Approve** chain. No structured-JSON “human reassembles prose” intermediate. Critic/constitution run **before** Approve; the site only projects.

### Reality check (repo as of 2026-07-31)

A sample package **already exists**, but off-contract path:

| Actual today | Locked contract |
|--------------|-----------------|
| `data/articles/2026-07-31-loomer-….md` | `content/articles/{date}-{slug}.md` |
| `public/articles/2026-07-31-loomer-…/fetched_….jpg` | same path shape — **keep** |
| Frontmatter has `id`, `seo_title`, `description`; no `entityIds` / `claimIds` / `image` / `dek` | contract below (superset that accepts the sample) |

**Phase A/B migration step (required):** move `data/articles/*.md` → `content/articles/`; do **not** leave a dual article root. `data/` stays index + scored-news + schema only.

### Article frontmatter (contract — match for new packages)

Zod/Content Collection validates this. Fields marked *compat* are accepted so the existing sample and future Bezalel output both pass.

```yaml
---
# Required
id: string                 # package id, e.g. canon_cjob_… (traceability; not shown as NCI)
title: string
date: string               # ISO date OR datetime (e.g. 2026-07-31 or 2026-07-31T07:06:17.757Z)
slug: string               # URL slug, lower-kebab; file name = {YYYY-MM-DD}-{slug}.md
density: "thin"|"medium"|"dense"
framing: "default"|"veil"
tags: string[]             # prefer low-cardinality topics; high-cardinality names can live in entityIds later

# Strongly recommended (moat + SEO)
entityIds: string[]?       # MUST exist in site-index.json entities[].id if present
claimIds: string[]?        # MUST exist in site-index.json claims[].id if present
dek: string?               # short subtitle for cards / OG
description: string?       # *compat* — treated as dek if dek missing (sample package uses this)
image: string?             # site path, e.g. /articles/2026-07-31-foo/cover.jpg — MUST exist under public/ if set
series: string | string[]? # *compat* — schema.ts Article.series is string[]; normalize to string[] at load
citations: string[]?       # source URLs or short refs
seo_title: string?         # *compat* — OG/title override; falls back to title
nci_overall: number?       # internal QA only — NEVER rendered publicly (sample uses scale ~1–5)
status: "draft"|"published"?  # default published if omitted; drafts excluded from desk/RSS
author: string?            # default house byline if omitted
---
```

**Public rendering rules for critic culture (not the score):**

- Show claim vs evidence separation and **“What is not established”** blocks when present in body (sample already has this section).
- Never show `nci_overall`, raw critic scores, or “NCI 87” badges.
- Related rails use `entityIds` / `claimIds` / tags — not keyword soup alone.

### Observation append (`data/scored-news/`)

One Observation per article–entity mention, matching `data/schema.ts` `Observation` exactly:

`id`, `entityId`, `source`, `sourceType` (`"article"` | `"scored-news"` | …), `timestamp`, `scores`, `signalStrength`, `context`.

`scanIndex.js` ingests append-only; **never auto-creates entities**. Unknown `entityId` → `manualReviewRequired` → **exit 1** → CI fails. That is the “site doesn’t invent claims” gate for observations.

### CI gate (deploy command — must all pass)

```bash
npm run scan     # scored-news ingest + index integrity + (Phase B+) markdown entity/claim/image checks
npm run check    # astro check — Content Collection frontmatter against contract
npm run build    # static site; missing public image paths / slug collisions fail here or in scan
```

**Failure modes (hard):**

| Failure | Who fails it |
|---------|----------------|
| Observation / index ref to unknown entity or claim | `npm run scan` (exit 1) |
| Article frontmatter `entityIds` / `claimIds` unknown | `npm run scan` **after Phase B extension** (see gap below) |
| `image` path set but file missing under `public/` | scan (B) or build check |
| Frontmatter enum/type invalid (`density`, `framing`, date) | `astro check` / Content Collection zod |
| Two files same `slug` | **build-time error** (recommended default; see open items) |
| Draft-only packages | excluded from desk index/RSS; not a fail |

### Critical gap to close in Phase B (do not ship desk without this)

Today `scripts/scanIndex.js` only validates **`site-index.json` → `articles[]`**. It does **not** read markdown under `content/articles/`.  

**Required extension:** after Content Collections exist, either:

1. **Publisher always appends** a matching `articles[]` row (artifact #4) **and** scan continues to check that array, **or**  
2. Scan gains a step: load all `content/articles/*.md` frontmatter and validate `entityIds` / `claimIds` / optional image paths against the index and filesystem.

Prefer **both**: artifact #4 keeps the index as the shared brain; MD scan is the belt-and-suspenders so a half-commit cannot invent entities.

---

# Information architecture (target sitemap)

```
theveilpress.com
├── /                        Home — one lead + one book CTA + one film + Brief capture
│                            (during active founders window: see open item #1 / dual home)
├── /desk                    News & analysis index (Canonical Packages)
│   ├── /desk/[slug]         Article
│   ├── /desk/entities/[id]  Entity pages (moat)
│   └── /desk/map            Living map (Phase C)
├── /library                 Books & guides
│   ├── /library/veil        Main book (from SquareMile)
│   ├── /library/map         Companion (+ print/ebook subpaths)
│   ├── /library/founders    Founders / signed / scarcity
│   └── /library/checkout/[planId]  Hybrid checkout (port HybridCheckout)
├── /watch                   Video hub
│   └── /watch/[id]          Optional deep links (Phase C)
├── /brief                   Newsletter capture → listmonk later
├── /journey                 Thin “why this exists” (optional; can fold into About — open item)
└── /about                   Author, method, contact (no overshare)

Nav (simple): Desk · Library · Watch · Brief · About
(+ Journey only if kept as its own surface)
```

**Home is not a 12-product wall.** Home is: one lead story slot, one secondary optional, one book CTA (gold), one video, one email capture.

**Funnel:** cold traffic (X, Rumble, SEO, shorts) → Desk or Watch → Brief → Library.  
Secondary: Watch → Journey/About → Brief → Library.  
Bezalel GrowthGoal optimizes **Brief signups + Library conversion**, not vanity pageviews.

### Path compatibility (non-negotiable — Gumroad / QR / thank-you)

Current live SPA routes (`src/App.jsx`) that **must still resolve** after Astro:

| Current | Target |
|---------|--------|
| `/` | Press home **or** founders (open item #1) |
| `/presale` | currently → `/`; keep redirect or → `/library/founders` |
| `/presale/executive` | → `/library/founders` (or keep page) |
| `/presale/executive/thank-you` | keep ThankYou page |
| `/home` | cinematic marketing page (optional alias of `/` or soft-land) |
| `/books` | → `/library` |
| `/books/square-mile` | → `/library/veil` |
| `/books/square-mile/companion` | → `/library/map` |
| `/books/square-mile/companion/print` | → `/library/map/print` (or same page) |
| `/books/square-mile/companion/ebook` | → `/library/map/ebook` |
| `/books/square-mile/checkout/:planId` | → `/library/checkout/:planId` |
| `/about` | `/about` |

Implement via Astro `redirects` in `astro.config.mjs` (or host redirects). **Do not break external QR / thank-you deep links.**

### Deploy config (Phase A — often missed)

Current `vercel.json` is an **SPA rewrite to `index.html`**. That is wrong for multi-page Astro static output.

- [ ] Replace SPA catch-all with Astro/Vercel static defaults (or delete rewrites and let framework adapter handle it).
- [ ] Keep asset passthrough for `/audio/`, `/videos/`, images, etc.

---

# Phase A — Astro migration + visual system (no desk product)

**Goal:** same cinematic DNA, glossier glass system, four-surface IA, all commerce intact. Desk = graceful empty stub. No Bezalel product dependency.

**Hard gate (charter):** do **not** productize the desk UI until Publisher can ship an approved package without hand-CMS every time. A single migrated sample post is OK as a **preview fixture**; the empty-state remains until pipeline is boringly reliable.

## Target tree

```
theveilpress/
  astro.config.mjs              # NEW — port vite server (port 5180, strictPort) + redirects + site URL
  content.config.ts             # NEW — empty/minimal collections until Phase B
  content/
    articles/                   # NEW — Bezalel write path (migrate data/articles/* here)
  public/
    articles/                   # EXISTS — keep; Bezalel media landing zone
  src/
    layouts/
      BaseLayout.astro          # nav chrome, grain, soundtrack shell, footer, SEO <head>
      DeskLayout.astro          # solid body + glass rail (stub shell in A)
      LibraryLayout.astro
    components/
      glass/                    # CSS-first (see note)
        NavChrome.astro         # Desk · Library · Watch · Brief · About
      commerce/
        BuyButton.tsx           # island — port BuyButton.jsx
        HybridCheckout.tsx      # island — port HybridCheckout page logic
      cinematic/                # ALL as React islands (vibe non-negotiable)
        HeroScene/              # WebGL, capability-gated
        VeilIntro.jsx
        Grain.jsx
        GoldDust.jsx
        FogReveal.jsx
        SmoothScroll.jsx        # GSAP + Lenis via scroll.js
        CustomCursor.jsx
        TrailerPlayer.jsx
        Spotlight.jsx
        SoundtrackProvider.jsx  # MUST port — global music is part of brand
        GlobalMusicBar.jsx
        MusicPlayer.jsx
        Reveal.jsx  SplitTitle.jsx  TiltCover.jsx  MagneticButton.jsx  AnimatedPage.jsx
    pages/
      index.astro               # Home per IA (or founders dual — open item #1)
      desk/index.astro          # STUB empty state
      library/index.astro       # Books.jsx
      library/veil.astro        # SquareMile.jsx
      library/map.astro         # Companion.jsx (+ print/ebook if needed)
      library/founders.astro    # ExecutiveFounder + Presale content
      library/checkout/[planId].astro
      watch/index.astro         # STUB shell — grid of existing trailers OK
      brief.astro
      about.astro               # method + positioning one-liner
      journey.astro             # optional thin page (open item)
      home.astro                # optional alias of cinematic landing
      presale/…                 # redirects or thin wrappers
    data/
      soundtrack.js            # keep
    styles/
      tokens.css                # --vp-* from visual system §2
      glass.css                 # .vp-glass, --hero/card/rail/chrome §3
      index.css                 # ported cinematic language
    commerce.js                 # UNCHANGED SKU source of truth
    scroll.js  motion.js  webgl/ hooks/   # port as needed for islands
  data/
    schema.ts  site-index.json  scan-log.json
    scored-news/                # may be empty until Publisher
    ads.json                    # NEW — [] house slots (Phase D fills)
    articles/                   # REMOVE after migrate → content/articles/
  scripts/
    scanIndex.js                # keep; extend in Phase B
  vercel.json                   # FIX — no SPA rewrite
```

### Glass implementation note (visual system + perf)

- **CSS-first:** `.vp-glass`, `.vp-glass--hero|card|rail|chrome` in `glass.css` with tokens.
- Prefer pure CSS/Astro for lists and article chrome (SEO + mobile blur caps).
- React island only if a panel needs interaction beyond CSS hover.
- `prefers-reduced-transparency` → solid `--vp-bg-elevated`; mobile blur cap ~12px; **never frost longform body**.

### Steps

- [ ] Scaffold Astro 5 + `@astrojs/react`, `@astrojs/rss`, `@astrojs/sitemap`; port `vite.config.js` server/preview (5180, strictPort) → `astro.config.mjs`; remove Vite SPA entry/`index.html` app shell as primary.
- [ ] Fix `vercel.json` (drop SPA rewrite).
- [ ] Port CSS → `tokens.css` + `glass.css` + `index.css` per `VEILPRESS_VISUAL_SYSTEM.md`.
- [ ] Port **all** cinematic + soundtrack islands (list above) — vibe is non-negotiable.
- [ ] `BaseLayout.astro`: NavChrome, grain, atmosphere, music bar shell, footer (from `Layout.jsx`).
- [ ] Port library/commerce pages; preserve hybrid checkout + `commerce.js`.
- [ ] Wire full redirect table (books + presale + thank-you paths).
- [ ] Home: lead + book + film + Brief capture (not product wall). If founders window still owns `/`, implement dual-home decision from open item #1 without breaking checkout.
- [ ] `desk/index.astro` stub + `watch/index.astro` shell + `brief.astro` (form only).
- [ ] Scaffold `content/articles/`, migrate any `data/articles/*.md`, ensure `public/articles/` retained, `data/ads.json` = `[]`.
- [ ] `npm run test` (vitest) green; `npm run build` clean.
- [ ] Commit.

## Phase A done when

- Cinematic hero + glass + four-surface nav render; reduced-motion + reduced-transparency verified.
- Soundtrack / trailers still work.
- All prior checkout and companion URLs resolve.
- Desk is a graceful empty stub (or clearly marked fixture if sample MD is migrated early).

---

# Phase B — Desk pipeline (depends on Bezalel Canonical Package)

**Goal:** site becomes a projection surface. Approve → commit → deploy lights `/desk` with no hand-CMS.

**Bezalel-side hard gate (must lead):** live-fire green + real Canonical Package object + Publisher that commits all four artifacts. Until then: stub or single manual fixture only.

## Steps

- [ ] `content.config.ts` — Content Collection with **glob loader** at repo-root `content/articles/` (Astro 5 Content Layer; **do not** move Bezalel write path into `src/content`). Zod = §0 contract (including compat fields).
- [ ] **Extend `scanIndex.js` (or sibling `scripts/validateArticles.js`)** to validate MD frontmatter `entityIds` / `claimIds` / image paths; wire into `npm run scan` or `npm run ci`. Exit non-zero on unknown refs.
- [ ] Ensure Publisher contract includes `articles[]` registration (artifact #4) aligned with `schema.ts` `Article` (`id`, `title`, `slug`, `status`, `author`, `created`, `modified`, `tags`, `series[]`, `entityIds`, `claimIds`, `description`).
- [ ] `desk/index.astro` — glass cards: title, dek/description, date, tags, image; sort `date` desc; **no infinite scroll** (3–7 strong pieces/week ethos).
- [ ] `desk/[slug].astro`:
  - solid high-contrast body on `--vp-bg-elevated` (never frosted)
  - citations / sources block
  - body sections like “What is not established” render as first-class structure
  - glass rails: entities, claims, related articles (shared entityIds/tags), **one** contextual library CTA max, sticky Brief capture
  - **never** render `nci_overall`
- [ ] `desk/entities/[id].astro` — build-time from `site-index.json` × articles: name, type, aliases, article list, claims rail, related entities (`forcedRelationships` + co-mention).
- [ ] RSS `/rss.xml`, sitemap, per-article OG (`image` / `dek` / `seo_title`).
- [ ] Pagefind — `postbuild: pagefind --site dist`; search UI on desk/nav.
- [ ] Slug-collision: fail build if two published entries share `slug`.
- [ ] CI: `npm run scan && npm run check && npm run build` as single deploy command.
- [ ] Optional fixture: publish the Loomer sample **only after** entityIds exist in index (or ship with empty entityIds and no invented links).
- [ ] Commit.

## Phase B done when

- Approve in Bezalel → commit of four artifacts → deploy → live `/desk/[slug]` + entity linkage + RSS item.
- Deliberately broken package (unknown entity / missing image) fails CI.

---

# Phase C — Customer-facing “wow” (still zero runtime LLM)

Ranked by return (from consensus: map + archive + follow beat gimmicks).

## C1. Living entity map (Tier S)

- Build-time `src/data/map-export.json` (nodes = entities, edges = forcedRelationships + article co-mention).
- `/desk/map`: accessible list+graph v1 first; interactive (Sigma/D3) only if engagement earns it.
- Entity pages: “what’s new on the map this week” from recent observations.
- Fed **only** by approved packages / index — never live web scrape on the public map.

## C2. Ask the archive (corpus-only, retrieval-only)

- Build-time chunks → `src/data/archive-chunks.json` (chunk, article slug, entityIds, section).
- Client UI: query → lexical/entity rank → **exact excerpts + links**, no generative text.
- Hard refuse outside corpus. **No runtime LLM** (HANDOFF).
- Optional later server tier only if you explicitly accept it; default remains no.

## C3. Entity follow → Brief

- Explicit opt-in follows (entity/series) in `localStorage` — no shadow profiling.
- `/brief`: email + optional follow list → interim form; **listmonk** when Bezalel email desk is ready.
- Desk “For you” rail: client filter on followed ids; empty state if none.
- Voice Brief (house TTS) = stretch, not required.

## C4. Watch hub (studio feel, not sludge)

- Grid + player for owned shorts/trailers already on site; YouTube/Rumble as syndication mirrors later.
- Phase later: package-attached short when Bezalel production emits one.
- House visual language locked to visual system; no random AI clip collage.

## Deferred (not launch, not Phase C blockers)

| Item | When |
|------|------|
| Counter / “Read against” format for high-reach external pieces | Only when own desk pipeline is reliable; always Approve; grows map or skip |
| Public NCI badges | **Never** |
| Open-ended site chatbot / AI anchor / engagement bots | **Never** |
| Revive Adserver | Only if direct-sold house inventory earns it |
| Membership / Brief+ | Only if volume justifies |

## Phase C done when

- Map + entity pages grow on every publish/scan.
- Ask-the-archive cites corpus and refuses out-of-corpus.
- Brief capture + follow rail work.
- Watch hub shows house films cleanly.

---

# Phase D — Growth loop + house ads

- **Analytics:** Plausible CE / Umami (Bezalel self-host) **or** Vercel Analytics for v1. **Never in content PRs** (HANDOFF — separate stream). Prefer wiring a **lightweight** snippet as soon as multi-page ships (end of A or start of B) so C has data; full funnel reporting in D.
- Funnel: desk → brief → library; Conductor (Bezalel) reads analytics; site does not invent a second metrics brain.
- `data/ads.json`: house slots (leaderboard, in-article, sidebar) for **own library only**. Constitution on ad copy. **No third-party networks on desk. Ever.**
- Direct sponsorships only after trust; wall off from investigative lead pieces.
- A/B founders landing only when traffic justifies.

---

# Hard rules (never break)

1. Site is a **projection** — no claims beyond the approved package; scan + check enforce it.
2. **NCI is internal only** — never a public badge or score.
3. **No third-party ad networks** on desk; house inventory only.
4. **No runtime LLM** on the public site; Ask the Archive = retrieval + excerpts.
5. **Git is the single data pipe**; analytics never in content PRs; `commerce.js` is SKU truth.
6. Longform body is **solid and high-contrast**; glass for hero/cards/rails/chrome only.
7. No auto-publish, no engagement bots, no AI anchor, no behavior-scraped personalization.
8. **Scan never auto-creates entities**; unknown refs → human review → CI fail.
9. Human/seed index fields preserved forever; machine fields refresh only via reviewable steps.
10. Preserve checkout / QR / thank-you URLs across the migration.
11. **Background rebuild only** — no production push/deploy/cutover until the rebuild is complete and you explicitly approve. Live site stays the current Vite SPA until then.

---

# Success metrics (site-level — for GrowthGoal later)

| Metric | Why |
|--------|-----|
| Brief email signups / week | Owned audience |
| Library conversion (visit → buy) | Revenue |
| Desk packages published / week | Pipeline health |
| Returning visitors to `/desk` | Habit |
| Watch completion on key films | Creative quality |
| Founders units (in window) | Seed capital |
| Map/archive engagement (Phase C) | Compounding moat use |

---

# What not to do

| Trap | Why |
|------|-----|
| Full CMS newsroom / Payload / Directus / WordPress | Unearned complexity; Git is the pipe |
| Next.js SSR by default | Heavier; static press doesn’t need it (Astro locked) |
| Rebuild Gumroad day one | Checkout already works |
| Homepage = every product + every video | Dilutes the journey |
| Auto-publish without Approve | Charter violation |
| Veil cameo spam on every article | Method, not brand wallpaper |
| Frost entire article column | Kills readability and trust |
| Lead with “we use AI” / public NCI | Commodity + theater |
| Dual article roots (`data/articles` + `content/articles`) | Breaks Publisher contract |

---

# Open items (need your call)

1. **Founders / home ownership** — Today `/` **is** the Presale storefront. After rebuild: (a) press home on `/` and founders at `/library/founders` + redirects, or (b) keep founders on `/` until the window ends, then flip. **Recommendation:** (a) with strong founders CTA on home during the window.
2. **`/presale` shape** — 301 → `/library/founders` vs keep thin alias. **Recommendation:** 301 + keep `/presale/executive/thank-you`.
3. **Desk empty-state copy** — “The desk opens when the pipeline lands” — OK, or prefer something quieter?
4. **Ask-the-archive v1** — retrieval-only, no runtime LLM. **Recommendation: confirm** (HANDOFF).
5. **Analytics v1** — Plausible self-host (Bezalel) vs Vercel Analytics (zero-config). **Recommendation:** Vercel Analytics for A/B speed, Plausible when Bezalel ops ready.
6. **Slug collisions** — fail build (recommended) vs last-write wins.
7. **`/journey` page** — keep as thin surface vs fold into About + home dek. **Recommendation:** fold into About for Phase A; add `/journey` only if Brief funnel needs a dedicated story page.
8. **Bezalel frontmatter sync** — confirm Publisher will emit `entityIds` / `claimIds` / `image` / `dek` (or `description`) and write to **`content/articles/`** (not `data/articles/`). Sample package needs a one-time path + field upgrade.

---

# Execution order

1. **Phase A** on disk (branch/worktree) — Astro + glass + IA + commerce + redirects + vercel fix + article path scaffold/migrate. Live site untouched.  
2. **Phase B** when Bezalel can emit a real four-artifact package (or immediately after A using one upgraded fixture to prove the pipe). Still local/background.  
3. **C1 map + C2 archive** once B data exists (independent of further Bezalel features).  
4. **C3 Brief follows + C4 Watch polish + D growth/ads.**  
5. **Cutover** only after complete + explicit go — merge/deploy replaces the live Vite site in one controlled switch.

---

# Phase A start checklist (first commit scope)

When you say go — **local/background only; no production deploy:**

1. Prefer isolated branch (e.g. `astro-site-rebuild`) or worktree so default deploy branch keeps shipping the current SPA if anything is already connected.  
2. Astro scaffold + React integration + config port (5180).  
3. CSS split: tokens + glass + existing index language.  
4. Islands: cinematic suite **including soundtrack**.  
5. Nav + layouts; desk/watch stubs.  
6. Library/commerce ports + full redirect table.  
7. `vercel.json` SPA rewrite removal **in the rebuild branch only** (do not land this on the live deploy branch until cutover).  
8. `content/articles/` + migrate sample MD; leave desk stub until B schema lights it.

**Not in first commit:** Pagefind, entity pages, Ask the archive, ads serving, listmonk, production cutover.
