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
 * Standalone:
 *   Print book ............... $35.99
 *   Ebook (PDF) .............. $19.99
 *   Audiobook ................ $17.99
 *   Companion Guide .......... $19.99
 *
 * Bundles (Companion valued at $5.99 when added):
 *   Print + Companion .................. $41.99
 *   Ebook + Companion .................. $25.99
 *   Audiobook + Companion .............. $23.99
 *   Ebook + Audiobook + Companion ...... $34.99
 *   Full (Print+Ebook+Audio+Companion) . $59.99
 */

/**
 * @typedef {{ url: string, price: number, label: string, name: string, blurb: string }} Product
 */

/** Companion add-on price when sold inside a bundle (not a separate product). */
export const COMPANION_BUNDLE_PRICE = 5.99;

/** @type {Record<string, Product>} */
export const products = {
  print: {
    name: "Print Book",
    price: 35.99,
    label: "Buy Print · $35.99",
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
      "Apparatus only: glossary, timelines, trees, bibliography, steelman. $5.99 when added in any bundle.",
  },
  bundlePrintCompanion: {
    name: "Print + Companion",
    price: 41.99,
    label: "Print + Companion · $41.99",
    url: "",
    blurb: "Paperback plus Companion Guide (Companion at $5.99).",
  },
  bundleEbookCompanion: {
    name: "Ebook + Companion",
    price: 25.99,
    label: "PDF + Companion · $25.99",
    url: "",
    blurb: "PDF plus Companion Guide (Companion at $5.99).",
  },
  bundleAudioCompanion: {
    name: "Audiobook + Companion",
    price: 23.99,
    label: "Audio + Companion · $23.99",
    url: "",
    blurb: "Audiobook plus Companion Guide (Companion at $5.99).",
  },
  bundleEbookAudioCompanion: {
    name: "Ebook + Audiobook + Companion",
    price: 34.99,
    label: "Digital + Companion · $34.99",
    url: "",
    blurb: "PDF, audiobook, and Companion Guide (Companion at $5.99).",
  },
  bundleFull: {
    name: "Full Bundle",
    price: 59.99,
    label: "Full Bundle · $59.99",
    url: "",
    blurb:
      "Print + ebook + audiobook + Companion Guide. Everything in one checkout.",
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
      addOnPrice: COMPANION_BUNDLE_PRICE,
    };
  },

  get bundles() {
    return {
      printCompanion: products.bundlePrintCompanion,
      ebookCompanion: products.bundleEbookCompanion,
      audioCompanion: products.bundleAudioCompanion,
      ebookAudioCompanion: products.bundleEbookAudioCompanion,
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
