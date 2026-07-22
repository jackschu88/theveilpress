# The Veil Press — website

Hybrid stack: **built here**, hosted free, your `.com` on top.

## Local

```bash
cd theveilpress
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Deploy (Vercel)

1. Push this folder to GitHub (or deploy from CLI).
2. Import project in [vercel.com](https://vercel.com) — framework: Vite.
3. Add domain `theveilpress.com` in Vercel → Domains.
4. At your registrar, set DNS to Vercel’s records.

## Deploy (Cloudflare Pages)

1. Connect repo or upload `dist` after `npm run build`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Attach custom domain.

## Routes

| Path | Page |
|------|------|
| `/` | Imprint home |
| `/books` | Catalogue |
| `/books/square-mile` | Volume I |
| `/books/square-mile/companion` | Companion |
| `/books/square-mile/companion/print` | QR target (same page for now) |
| `/books/square-mile/companion/ebook` | Ebook buyer path |
| `/about` | Press + author |

## Purchase links

All checkout URLs live in **one file**:

```text
src/commerce.js
```

| Field | Use |
|--------|-----|
| `squareMile.printUrl` | Amazon (or other) print listing |
| `squareMile.ebookUrl` | Gumroad/Lemon PDF checkout |
| `companion.fullUrl` | Companion standalone ~$19.99 |
| `companion.printBuyerUrl` | Companion $5.99 (print QR path) |
| `companion.ebookBuyerUrl` | Companion $5.99 (ebook thank-you path) |

Leave a field as `""` → button shows **Coming soon / Link pending**.  
Paste a real `https://...` URL → button goes live (opens in new tab).

### Suggested store setup

1. **Amazon KDP** — publish paperback → copy product URL → `printUrl`
2. **Gumroad or Lemon Squeezy**
   - Product A: *Square Mile PDF*
   - Product B: *Companion full* ($19.99)
   - Product C: *Companion book-buyer* ($5.99)  
     **or** one Companion product + offer code links for print/ebook
3. After PDF purchase, set thank-you / receipt link to:  
   `https://theveilpress.com/books/square-mile/companion/ebook`
4. Print QR code target:  
   `https://theveilpress.com/books/square-mile/companion/print`

### Next wiring

- [ ] Buy `theveilpress.com`
- [ ] Fill `src/commerce.js` with live URLs
- [ ] Real PDF / Companion file delivery on Gumroad/Lemon



