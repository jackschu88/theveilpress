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
 *   Digital Edition .......... $19.99
 *   Audiobook ................ $17.99
 *   Companion Guide .......... $19.99
 *
 * Bundles:
 *   Digital Edition + Audiobook ........ $29.99
 *   Print + Companion .................. $44.99  (Companion at $8.99)
 *   Digital Edition + Companion ........ $28.99
 *   Audiobook + Companion .............. $26.99
 *   Digital + Audiobook + Companion .... $38.99
 *   Full (Print+Digital+Audio+Companion) $64.99
 */

/**
 * @typedef {{ url: string, price: number, label: string, name: string, blurb: string }} Product
 */

/** Companion add-on price when sold inside a bundle (not standalone $19.99). */
export const COMPANION_BUNDLE_PRICE = 8.99;

/** @type {Record<string, Product>} */
export const products = {
  print: {
    name: "Print Book",
    price: 35.99,
    label: "Buy Print · $35.99",
    url: "",
    blurb: "Trade paperback. Coming soon.",
  },
  ebook: {
    name: "Digital Edition",
    price: 19.99,
    label: "Buy Digital Edition · $19.99",
    url: "https://theveilpress.gumroad.com/l/riwlqv",
    blurb: "Instant download. Full digital edition of the volume.",
  },
  audiobook: {
    name: "Audiobook",
    price: 17.99,
    label: "Buy Audiobook · $17.99",
    url: "https://theveilpress.gumroad.com/l/rphkx",
    blurb: "Full narration. Instant digital delivery.",
  },
  companion: {
    name: "Companion Guide",
    price: 19.99,
    label: "Get Companion · $19.99",
    url: "",
    blurb:
      "Apparatus only: glossary, timelines, trees, bibliography, steelman. $8.99 when added in any bundle.",
  },
  bundlePrintCompanion: {
    name: "Print + Companion",
    price: 44.99,
    label: "Print + Companion · $44.99",
    url: "",
    blurb: "Paperback plus Companion Guide (Companion at $8.99).",
  },
  bundleEbookCompanion: {
    name: "Digital Edition + Companion",
    price: 28.99,
    label: "Digital + Companion · $28.99",
    url: "",
    blurb: "Digital Edition plus Companion Guide (Companion at $8.99).",
  },
  bundleAudioCompanion: {
    name: "Audiobook + Companion",
    price: 26.99,
    label: "Audio + Companion · $26.99",
    url: "",
    blurb: "Audiobook plus Companion Guide (Companion at $8.99).",
  },
  bundleEbookAudio: {
    name: "Digital Edition + Audiobook",
    price: 29.99,
    label: "Digital + Audio · $29.99",
    url: "https://theveilpress.gumroad.com/l/ggmum",
    blurb: "Digital Edition and audiobook together. Save vs buying separate.",
  },
  bundleEbookAudioCompanion: {
    name: "Digital Edition + Audiobook + Companion",
    price: 38.99,
    label: "Digital + Audio + Companion · $38.99",
    url: "",
    blurb:
      "Digital Edition, audiobook, and Companion Guide (Companion at $8.99).",
  },
  bundleFull: {
    name: "Full Bundle",
    price: 64.99,
    label: "Full Bundle · $64.99",
    url: "",
    blurb:
      "Print + Digital Edition + audiobook + Companion Guide. Everything in one checkout.",
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
      ebookAudio: products.bundleEbookAudio,
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
