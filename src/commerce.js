/**
 * The Veil Press — Gumroad storefront
 * -----------------------------------
 * All website checkout goes through Gumroad.
 * Paste each product's Gumroad share URL below when live.
 * Leave a URL as "" to show "Coming soon" / "Checkout pending".
 *
 * Gumroad product URL shape:
 *   https://YOURNAME.gumroad.com/l/PRODUCT-SLUG
 * Optional overlay: append ?wanted=true
 *
 * Pricing (Gumroad / this website) — locked:
 *   Print book ............... $36.99
 *   Ebook (PDF) .............. $19.99
 *   Audiobook ................ $17.99
 *   Companion Guide .......... $19.99
 *   Ebook + Audiobook ........ $29.99
 *   Print + Ebook ............ $49.99
 *   Full All-in-One .......... $59.99  (print + ebook + audiobook + companion free)
 *
 * IngramSpark / wide distribution (not used on this site):
 *   Print $37.99 · Ebook $24.99
 */

/**
 * @typedef {{ url: string, price: number, label: string, name: string, blurb: string }} Product
 */

/** @type {Record<string, Product>} */
export const products = {
  print: {
    name: "Print Book",
    price: 36.99,
    label: "Buy Print · $36.99",
    url: "",
    blurb: "Trade paperback. Ships via Gumroad / print fulfillment.",
  },
  ebook: {
    name: "Ebook (PDF)",
    price: 19.99,
    label: "Buy PDF · $19.99",
    url: "",
    blurb: "Instant download. PDF edition of the full volume.",
  },
  audiobook: {
    name: "Audiobook",
    price: 17.99,
    label: "Buy Audiobook · $17.99",
    url: "",
    blurb: "Full narration. Instant digital delivery.",
  },
  companion: {
    name: "Companion Guide",
    price: 19.99,
    label: "Get Companion · $19.99",
    url: "",
    blurb:
      "Apparatus only: glossary, timelines, trees, bibliography, steelman.",
  },
  bundleEbookAudio: {
    name: "Ebook + Audiobook",
    price: 29.99,
    label: "Ebook + Audio · $29.99",
    url: "",
    blurb: "PDF + audiobook together. Save vs buying separate.",
  },
  bundlePrintEbook: {
    name: "Print + Ebook",
    price: 49.99,
    label: "Print + PDF · $49.99",
    url: "",
    blurb: "Paperback plus instant PDF.",
  },
  bundleFull: {
    name: "Full All-in-One Bundle",
    price: 59.99,
    label: "Full Bundle · $59.99",
    url: "",
    blurb: "Print + ebook + audiobook. Companion Guide included free.",
  },
};

const commerce = {
  products,

  get squareMile() {
    return {
      printUrl: products.print.url,
      ebookUrl: products.ebook.url,
      audiobookUrl: products.audiobook.url,
      printLabel: products.print.label,
      ebookLabel: products.ebook.label,
      audiobookLabel: products.audiobook.label,
      printPrice: products.print.price,
      ebookPrice: products.ebook.price,
      audiobookPrice: products.audiobook.price,
    };
  },

  get companion() {
    return {
      fullUrl: products.companion.url,
      fullLabel: products.companion.label,
      fullPrice: products.companion.price,
      bundleUrl: products.bundleFull.url,
      bundleLabel: products.bundleFull.label,
      bundlePrice: products.bundleFull.price,
    };
  },

  get bundles() {
    return {
      ebookAudio: products.bundleEbookAudio,
      printEbook: products.bundlePrintEbook,
      full: products.bundleFull,
    };
  },
};

export function hasUrl(url) {
  return typeof url === "string" && url.trim().length > 0;
}

export function formatPrice(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "";
  return `$${n.toFixed(2)}`;
}

/** True when any product has a live checkout URL. */
export function anyCheckoutReady() {
  return Object.values(products).some((p) => hasUrl(p.url));
}

export default commerce;
