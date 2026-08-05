# The Veil Press — Visual System
## Gloss cinematic press UI

**Version:** 0.1 · for site rebuild (Astro + React islands)

---

## 1. Intent

Dark, cinematic, serious. One step glossier than the current site: glass over depth, not SaaS frosted widgets.
Feel: night museum vitrine · steel and fog · premium press
Not: crypto landing, iOS settings, pastel glassmorphism, bright news portal

---

## 2. Color tokens

```css
--vp-bg-deep:        #07080c          /* page stage */
--vp-bg-elevated:    #0c0e14          /* solid content wells */
--vp-bg-fog:         #10131c          /* subtle mid plane */

--vp-glass-fill:         rgba(8, 10, 16, 0.55)
--vp-glass-fill-strong:  rgba(8, 10, 16, 0.72)
--vp-glass-fill-hero:    rgba(8, 10, 16, 0.42)

--vp-edge:           rgba(255, 255, 255, 0.14)
--vp-edge-hot:       rgba(255, 255, 255, 0.22)

--vp-text-primary:   #e8eaef
--vp-text-secondary: #9aa3b5
--vp-text-muted:     #6b7385

--vp-accent-steel:   #7a92b5          /* links, quiet chrome */
--vp-accent-gold:    #c4a574          /* primary CTA only — sparse */
--vp-accent-gold-hi: #d4b88a

--vp-rule:           rgba(255, 255, 255, 0.08)
--vp-grain-opacity:  0.04–0.07
```

**Accent rule:** gold is for one primary action per view (Buy, Begin, Subscribe). Everything else steel or neutral.

---

## 3. Glass material

```css
backdrop-filter:     blur(16px) saturate(1.15);
-webkit-backdrop-filter: same;

border:              1px solid var(--vp-edge);
box-shadow:
  0 0 0 1px rgba(0,0,0,0.35) inset,
  0 8px 32px rgba(0,0,0,0.45);

/* optional top specular */
background-image:
  linear-gradient(
    180deg,
    rgba(255,255,255,0.06) 0%,
    rgba(255,255,255,0) 40%
  ),
  var(--vp-glass-fill);
```

| Variant | Fill | Blur | Use |
|---------|------|------|-----|
| Hero | glass-fill-hero | 20–24px | Home lead slab |
| Card | glass-fill | 14–16px | Desk cards, library cards |
| Rail | glass-fill-strong | 12px | Related, entity, brief strip |
| Chrome | strong | 12px | Nav, sticky bars |

**Fallbacks**

```css
@media (prefers-reduced-transparency: reduce) {
  /* solid elevated panels, same borders, no blur */
}
```

Mobile: cap blur at ~12px; prefer solid for long article body.

---

## 4. Radius & spacing

```css
--vp-radius-sm:   8px     /* chips, small controls */
--vp-radius-md:   12px    /* cards, inputs */
--vp-radius-lg:   16px    /* hero glass, modals */

--vp-space-1: 4px
--vp-space-2: 8px
--vp-space-3: 12px
--vp-space-4: 16px
--vp-space-5: 24px
--vp-space-6: 32px
--vp-space-7: 48px
--vp-space-8: 64px
```

Cards: padding `--vp-space-5` minimum. Don't pack glass tight.

---

## 5. Typography

- **Display / headlines:** existing cinematic serif (brand continuity)
- **UI / body:** clean grotesque (system-ui stack or Inter/Geist)

```css
--vp-text-hero:     clamp(2rem, 4vw, 3.25rem) / 1.15 / weight 500–600
--vp-text-h1:       1.75–2.25rem
--vp-text-h2:       1.35–1.5rem
--vp-text-body:     1.05–1.125rem / 1.65
--vp-text-small:    0.8125–0.875rem
--vp-text-meta:     0.75rem / tracking slightly open / secondary color
```

On glass: avoid ultra-thin weights. Body on article pages sits on solid `--vp-bg-elevated`, not frosted glass.

---

## 6. Panel variants (components)

**Hero glass**
- Max width ~720–840px content inside
- Large padding (space-6–space-7)
- One headline, one dek, one gold CTA, optional secondary steel text link
- Sits over full-bleed cinematic still / WebGL / fog

**Card glass (desk / library)**
- Image or cover optional top
- Title + dek + meta row (date, series, tags)
- Hover: edge → edge-hot, shadow lifts slightly (2–4px), no bouncy scale
- Library cards may use stronger specular (product sheen)

**Rail glass**
- Narrower, quieter type
- Entity links, "related," watch-next
- No heavy gloss

**Nav chrome**
- Thin glass or near-solid bar
- Hairline bottom rule
- Logo left; Desk · Library · Watch · Brief · About
- Active state: gold underline or steel weight change — not a bright pill

---

## 7. Motion tokens

```css
--vp-ease:         cubic-bezier(0.22, 1, 0.36, 1)
--vp-duration-fast: 150ms
--vp-duration:      280ms
--vp-duration-slow: 500ms
```

- Page enter: opacity + 8–12px rise, `--vp-duration`
- Hover: edge + shadow only
- Scroll: optional single parallax on hero background — not every panel
- No elastic, no spin, no constant particle storms over text

---

## 8. Surface rules

| Surface | Glass use | Solid use |
|---------|-----------|-----------|
| Home | Hero + card row | Background stage only |
| Desk index | Cards | Page ground |
| Article | Pull-quote, related rail, sticky CTA | Main column text |
| Library | Product cards | Ground |
| Watch | Title chrome | Player + stills full-bleed |
| Brief | Form panel | Ground |

---

## 9. Do / Don't

**Do**
- Stack: deep stage → fog/grain → glass → sharp type
- One gold CTA per major view
- Hairline edges and quiet rules
- High contrast for longform
- Preserve cinematic hero craft as islands

**Don't**
- Frost the entire article column
- White or pastel glass
- Rainbow gradients / neon
- Dashboard metric widgets on press pages
- Pill-shaped everything
- Glass on glass on glass with no depth behind

---

## 10. Asset notes

- Hero stills: dark, cool grade, room for type-safe zones
- Book covers: full color; glass frames them, doesn't recolor them
- Grain: CSS noise or 2K overlay at 4–7% opacity; disable if it fights performance
- Favicon / OG: still dark cinematic — match book world, not flat logo on white

---

## 11. Implementation priority

1. Tokens in CSS variables (global)
2. `.vp-glass`, `.vp-glass--hero`, `.vp-glass--card`, `.vp-glass--rail`
3. Nav + Home hero + one card style
4. Article layout (solid body + glass rail)
5. Library cards (gloss ceiling)
6. Reduced-transparency + mobile blur caps

---

## 12. One-line handoff

Deep black stage, cool steel light, sparse gold CTA; dark glass panels with hairline specular edges over grain/fog; hero and product cards glossy; longform solid and sharp; motion slow; never generic SaaS glass.
