# Capture Strategy — theveilpress.com

**Context:** $14 FB ad spend / 3 days → 117 visitors at ~$0.12 CPC (traffic is cheap and working). Zero cold-traffic sales across 13 SKUs. 87% mobile. 85% bounce rate. The offer is a $40–$130 pre-order — too big an ask for someone who just clicked an ad and has never heard of the book. The fix is not "sell harder," it's **capture first, sell later**: turn cheap clicks into an owned list you can nurture and retarget, instead of losing them forever at 85% bounce.

This plan is based on reading the live production code and the actual deployed site on 2026-08-09/10, not assumptions.

---

## Status: P0 + P1 shipped and live (2026-08-10)

Everything in P0 and P1 below is implemented and deployed to production (www.theveilpress.com) as of 2026-08-10, except the two items that need Jack's own credentials (Meta Pixel ID, FB Ads Manager access — see notes on items #4 and #11). What follows is kept as the historical record of the plan and the reasoning behind it; check the "Shipped" note under each item for what actually exists in the code today.

- **`/brief` signup form was broken in production.** `PUBLIC_BRIEF_FORM_ACTION` was never set in Vercel prod, so every visitor who found the page hit a disabled input with "Subscriptions not configured yet." Fixed: env var set, redeployed, verified live with a working Formspree-backed form.

---

## P0 — Do these next (highest leverage, low effort)

### 1. Give the email ask a reason to exist
Right now "Join the Brief" offers "a weekly signal through the noise" — no concrete value, no immediate payoff. Cold FB traffic doesn't have relationship capital with you yet; they need a reason to trade their email *right now*.

**Recommendation:** Build one real lead magnet — a free excerpt/first chapter PDF of *The Veil of the Square Mile*, or a condensed "primer" version of the Companion Guide's entity map. Nothing like this exists in the repo today (`src/pages`, content dirs — no excerpt content anywhere). Gate it behind the email form: "Get the first chapter free" is a completely different offer than "subscribe to a newsletter," and converts at a much higher rate on cold traffic.

Delivery is simple: email the PDF link via the Formspree `_next` redirect to a `/brief/thank-you` page with a direct download link, or attach it in the Formspree autoresponder.

While in there: `brief.astro` currently shows the disclaimer *"We'll send the Brief only. No resale. Interim form until listmonk."* to every visitor — internal implementation detail ("interim form until listmonk") leaking into copy a cold stranger sees. Cut it to something like "No spam, no resale, unsubscribe anytime" before driving more traffic there.

**Shipped (2026-08-10):** Real manuscript text — Volume Zero (Introduction) + Part I ("The Hidden Throne") — copied into the repo at `content/excerpt/` and rendered at `/brief/chapter-one`. `brief.astro` reframed around "Get the first chapter free," the listmonk disclaimer is gone, and `/brief/thank-you` now delivers the chapter immediately instead of dead-ending.

### 2. Move capture above the fold, and make it the primary CTA — not the fifth section
Current homepage order: hero (→ pre-order), companion trailer (→ pre-order), 4-card buy grid (→ pre-order), desk article, *then* Brief strip last. On 87% mobile traffic, "last" effectively means "never seen" — Vercel Analytics already shows `/brief` didn't even make the top-pages list out of 120 visitors.

**Recommendation:** Split the ask by traffic temperature.
- For paid FB traffic specifically, don't land on `/` at all — build a dedicated single-purpose landing page (e.g. `/read`) with one message, one CTA (get the free chapter), and none of the multi-SKU storefront. Point ads there instead of the homepage.
- On the homepage itself, add a secondary capture CTA directly under the hero trailer ("Not ready to buy? Get the first chapter free") so people who bounce off the $40+ ask still have a low-commitment option before they scroll past.

**Shipped (2026-08-10):** `/read` is live — single-purpose, no nav/footer (`BaseLayout minimal` prop), trailer + inline email form, nothing else. Homepage hero now has a "Not ready to buy? Get the first chapter free →" link directly under the primary CTAs. Every capture surface tags its source via `?src=` (home-hero, home-bottom, nav, watch, desk-article, chapter-one-end, nudge, read-landing) so signups can be segmented by entry point later (P2 #12). Ads still need to be pointed at `/read` in Meta Ads Manager — that's a Jack action, not a code change.

### 3. Cut or shorten the intro curtain animation for ad traffic
`src/components/cinematic/VeilIntro.tsx` runs a full-screen opaque black overlay (`#030306`, full viewport, `z-index: 9999`) on every first visit per session, holding for ~1 second before curtains even start opening, ~2.5s before the screen visually clears, ~4.25s total with the brand reveal. It's `pointer-events: none` so it's not technically blocking taps, but visually it's a black screen with no content for over a second — for someone who just tapped a Facebook ad on a phone expecting to see a book, that's dead time working directly against your 85% bounce number.

**Recommendation:** Either cut it entirely for now, or specifically suppress it when the visitor arrives via `?utm_source=facebook`/ad click params — paid traffic should hit content in under a second, full stop. Keep the cinematic intro for organic/direct visitors if you want to preserve the brand moment.

**Shipped (2026-08-10):** `VeilIntro.tsx` now detects `fbclid`, `gclid`, or `utm_source` matching facebook/fb/meta/instagram/ig and skips the curtain entirely for that visit, marking it seen in `sessionStorage` so it never shows later in the session either. Organic/direct visitors still get the full cinematic intro.

### 4. Install the Meta Pixel now, not after the next campaign
Still zero pixel in the codebase (only `@vercel/analytics/astro`). Every future test is unmeasurable from Facebook's side, and — more relevant to capture specifically — **you can't build a retargeting audience of the people who bounced** without it. Once installed:
- Fire `PageView` sitewide.
- Fire `Lead` on Brief form submit (Formspree success / `_next` redirect landing).
- Fire `ViewContent` on the storefront pages.
This lets you retarget the 85% who bounced with a cheap "get the free chapter" ad instead of paying full CPC to reacquire them cold.

**Shipped, but needs your input to activate:** `src/components/MetaPixel.astro` is wired into `BaseLayout` and fires `PageView` sitewide, `Lead` on `/brief/thank-you`, and `ViewContent` on `/library/veil` — but it's gated on a `PUBLIC_META_PIXEL_ID` env var (same pattern as `PUBLIC_BRIEF_FORM_ACTION`) that isn't set yet, so it currently no-ops. **I don't have your Meta Business/Events Manager access, so I can't create or supply a real Pixel ID.** Once you have one, tell me the ID and I'll set it in Vercel prod and redeploy the same way I did for the Formspree endpoint — one command, no code changes needed.

### 5. Stop shipping a blank screen on the actual product page
`src/pages/library/veil.astro` renders `<SquareMilePage client:only="react">`, which means **the product page has no server-rendered content at all** — visitors see only a "Loading the book page…" placeholder until the full React bundle downloads and hydrates client-side. On a phone on cellular via the Facebook in-app browser, that's real dead time on the one page that's supposed to close the sale. This is a bigger mobile-performance risk than any animation library — it's a blank page, not a slow one.

**Recommendation:** Convert at minimum the above-the-fold price/CTA block to server-rendered Astro markup (like `index.astro` and `brief.astro` already are) so there's real content the instant the HTML arrives, even if secondary sections still hydrate as React islands.

**Shipped (2026-08-10):** The `client:only="react"` fallback slot in `library/veil.astro` now renders real title/dek copy plus working softcover and hardcover buy buttons (pulled live from `commerce.js`, so prices/URLs can't drift out of sync), instead of a generic "Loading the book page…" message. A visitor sees real, functional content and can buy immediately, even before the React island finishes hydrating.

---

## P1 — Do these within the next week or two

### 6. Add a scroll-depth / exit-intent capture prompt
Nothing currently catches a visitor who's about to leave. A lightweight, non-annoying trigger — e.g. a slide-up bar after ~50% scroll depth, or on mobile a bottom sheet after N seconds — offering the same free-chapter lead magnet, gives you a second chance at the 85% who don't convert on the primary CTA. Keep it to one trigger per session (reuse the `sessionStorage` pattern already used by `VeilIntro`) so it isn't obnoxious.

**Shipped (2026-08-10):** `src/components/CaptureNudge.astro`, sitewide via `BaseLayout` (skipped on `/brief*` and `/read`, and on `minimal` layouts). Triggers on 50% scroll depth or desktop exit-intent (`mouseleave` at the top of the viewport), shows once per session, dismissible.

### 7. Give the nav "Brief" link real weight
In `NavChrome.astro`, "Brief" currently sits as a plain text link with equal visual weight to Desk/Library/Watch/About — no distinction, no incentive copy. Style it as a button (it already has `vp-btn--primary` used elsewhere) so it reads as an action, not just another page.

**Shipped (2026-08-10):** "Brief" removed from the plain nav-link list; replaced with a standalone gold "Free chapter" button (`/brief?src=nav`) at the end of the nav bar, visually distinct from the other four links on both desktop and mobile.

### 8. Add a capture point to `/desk` articles and `/watch`
These are real destinations people land on (7, 7, 6 visits respectively per the analytics snapshot) with zero capture mechanism today — a reader finishes an article and has nowhere to go but back or away. Add an inline or end-of-article capture card ("Get the next piece before it's public — join the Brief") to every article template and the `/watch` page.

**Shipped (2026-08-10):** Built one shared `src/components/BriefCTA.astro` (strip and rail variants) instead of duplicating markup. Desk articles' existing sidebar CTA now uses it (`src=desk-article`); `/watch` gets a full strip after the film grid (`src=watch`).

### 9. Close the loop on `/brief/thank-you`
Right now the thank-you page just says thanks and links to Desk/Library/Home — a dead end with no next action. Once the lead magnet exists (P0 #1), this page should deliver it immediately (download link/button) and make one soft, low-pressure pitch toward the presale, since you now have a warm lead instead of a cold one.

**Shipped (2026-08-10):** Done as part of P0 #1 — thank-you page now has a prominent "Read the first chapter now →" button straight to `/brief/chapter-one`, no waiting on email.

### 10. Reduce the purchase-path hops for people who skip capture and go straight to buy
Confirmed in code (`src/components/BuyButton.jsx`): every Gumroad checkout link opens in a **new tab** (`target: "_blank"`), and bundled products (softcover+Companion, etc.) route through an internal multi-step `/library/checkout/[planId]` page before ever reaching Gumroad, per the `isHybridProduct` branch. Both are real friction on top of the capture problem — a visitor who's ready to buy still has to survive a tab-switch and, for bundles, two separate external checkouts. Not the top lever (most cold traffic won't get this far yet), but worth fixing once capture is flowing and more people are reaching this step.

**Shipped (2026-08-10):** Removed `target="_blank"` from both `BuyButton` implementations (`src/components/BuyButton.jsx` and `src/components/commerce/BuyButton.tsx`) and from the new `library/veil.astro` fallback CTAs — Gumroad checkout now opens in the same tab. Left the hybrid two-step checkout itself alone (that's a Gumroad/IngramSpark platform constraint, not a quick fix).

---

## P2 — Worth testing once the above is live and generating signal

### 11. A/B test the ad landing destination
Once pixel data exists, split traffic between (a) the dedicated `/read` capture-only landing page and (b) the current homepage, and compare Lead events per dollar. Don't guess — let the pixel tell you which converts capture better.

**Needs you:** `/read` is built and live, but pointing your Facebook campaign(s) at it happens in Meta Ads Manager, which I don't have access to. Swap the destination URL on your ad(s) to `https://www.theveilpress.com/read` when you're ready to test.

### 12. Segment the list by entry point
If Formspree/whatever replaces it supports hidden fields, tag signups by source page (`/read` vs `/desk` vs exit-intent) so you know which capture surface is actually producing subscribers worth nurturing toward a sale.

**Shipped (2026-08-10):** Every capture surface links to `/brief?src=<surface>`. Since this site is a fully static build, the query string isn't available server-side — `brief.astro` ships a tiny inline script that reads `?src=` from the browser URL and fills the hidden `source` field before submit, so Formspree receives the real source per signup instead of a hardcoded default.

### 13. Revisit the checkout dead links
Separate from capture, but adjacent: some `hybridPlans` steps in `src/commerce` still show "Coming soon" for missing URLs.

**Correction (2026-08-10):** Re-read `src/commerce.js` directly — this isn't actually broken. Every SKU, including the "Coming August 26th" digital ones, has a real Gumroad URL; `saleStatus: "coming"` is deliberately gating them until the announced release date, not a missing link. Nothing to fix here.

---

## Why this order

The single biggest lever is P0 #1 + #2: you're currently asking cold traffic for either $40+ or "subscribe to updates" with nothing tangible in return, and burying that ask below content most mobile visitors never scroll to. Fixing the *offer* and its *placement* will move conversion more than any amount of traffic-quality or checkout work. The pixel (#4) doesn't lift conversion by itself, but without it you're flying blind on every subsequent test — it should go in alongside the offer fix, not after.

## Measurement

Before spending more ad dollars, define success as **Leads (Brief signups) per 100 visitors**, not sales. At $0.12 CPC, even a 5–8% capture rate turns a $14 test into 6–9 owned contacts you can nurture for free indefinitely — a much better unit economics story than waiting for a $40 cold-traffic purchase.

Note: custom events (`product_click`, `cta`, video plays) are already instrumented in `src/lib/analytics.js` via `@vercel/analytics`, but that file's own comment says the Events UI to view them requires Vercel's Web Analytics/Pro tier — worth checking your plan, since you may already have more signal than the free-tier dashboard shows you.

---

## Reconciling the DeepSeek report (2026-08-10)

A second AI-generated analysis of this same funnel came in independently and largely agreed with the above — no pixel, buried/valueless capture, unprofessional form copy, new-tab Gumroad handoff. Two of its specific technical claims were checked against the live code and don't hold up, so don't act on them:

- **"Three.js/GSAP/Lenis/custom cursor load on the homepage and cause the mobile slowness."** False for the page ads actually hit. Those libraries are real dependencies, but they're wired into an orphaned legacy route (`src/pages/home.astro` + the old `AppRoot` island — note the `s` — not `index.astro`, which is `/`) that isn't linked from nav and gets effectively no traffic. The real `/` homepage only uses Framer Motion. Item #5 above (the `client:only` blank product page) is the actual mobile-performance finding worth acting on.
- **"Auto-playing trailers kill mobile data."** False — the hero/companion `<video>` tags use `controls` + `preload="metadata"` with no `autoplay` attribute and no script forcing playback; nothing plays until tapped.

Everything else in that report (pixel, capture placement/value, form copy, new-tab checkout, hybrid checkout friction, lack of social proof) is consistent with this plan and already covered above.
