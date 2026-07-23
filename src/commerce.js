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
 *   Print book ............... $42.99
 *   Digital Edition .......... $15.99
 *   Audiobook ................ $17.99
 *   Companion Guide .......... $24.99
 *
 * Bundle pricing:
 *   Main product at full price; each add-on 20% off.
 *   Full (everything) bundle: main full price; each add-on 25% off.
 *   Then each bundle is lowered to a retail .99 price (e.g. $29.99).
 */

/**
 * @typedef {{ url: string, price: number, label: string, name: string, blurb: string }} Product
 */

/** Round money to cents. */
export function money(n) {
  return Math.round(n * 100) / 100;
}

export function formatPrice(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "";
  return `$${n.toFixed(2)}`;
}

/** Standalone list prices (source of truth). */
export const STANDALONE = {
  print: 42.99,
  ebook: 15.99,
  audiobook: 17.99,
  companion: 24.99,
};

/** Add-on discount rates: pay this fraction of list (0.8 = 20% off). */
export const ADDON_RATE = 0.8;
/** Full everything bundle: stronger add-on discount (0.75 = 25% off). */
export const FULL_BUNDLE_ADDON_RATE = 0.75;

/**
 * Bundle price: first item full list, each remaining item at add-on rate.
 * @param {number[]} listPrices — [main, ...addons] at standalone list
 * @param {number} [addonRate=ADDON_RATE]
 */
export function bundlePrice(listPrices, addonRate = ADDON_RATE) {
  if (!listPrices.length) return 0;
  const [main, ...addons] = listPrices;
  const addonTotal = addons.reduce(
    (sum, p) => sum + money(p * addonRate),
    0
  );
  return money(main + addonTotal);
}

/**
 * Largest retail .99 at or below n (e.g. 62.98 → 61.99, 30.38 → 29.99).
 * Already-ending .99 prices are left unchanged.
 */
export function charmPrice(n) {
  const cents = Math.round(n * 100);
  if (cents % 100 === 99) return money(n);
  return money(Math.floor(n) - 0.01);
}

/** Math total, then charm-priced for the storefront. */
export function storeBundlePrice(listPrices, addonRate = ADDON_RATE) {
  return charmPrice(bundlePrice(listPrices, addonRate));
}

const prices = {
  print: STANDALONE.print,
  ebook: STANDALONE.ebook,
  audiobook: STANDALONE.audiobook,
  companion: STANDALONE.companion,
  bundlePrintCompanion: storeBundlePrice([
    STANDALONE.print,
    STANDALONE.companion,
  ]),
  bundleEbookCompanion: storeBundlePrice([
    STANDALONE.ebook,
    STANDALONE.companion,
  ]),
  bundleAudioCompanion: storeBundlePrice([
    STANDALONE.audiobook,
    STANDALONE.companion,
  ]),
  bundleEbookAudio: storeBundlePrice([STANDALONE.ebook, STANDALONE.audiobook]),
  bundleEbookAudioCompanion: storeBundlePrice([
    STANDALONE.ebook,
    STANDALONE.audiobook,
    STANDALONE.companion,
  ]),
  bundleFull: storeBundlePrice(
    [
      STANDALONE.print,
      STANDALONE.ebook,
      STANDALONE.audiobook,
      STANDALONE.companion,
    ],
    FULL_BUNDLE_ADDON_RATE
  ),
};

/** @type {Record<string, Product>} */
export const products = {
  print: {
    name: "Print Book",
    price: prices.print,
    label: `Buy Print · ${formatPrice(prices.print)}`,
    url: "",
    blurb: "Trade paperback. Coming soon.",
  },
  ebook: {
    name: "Digital Edition",
    price: prices.ebook,
    label: `Buy Digital Edition · ${formatPrice(prices.ebook)}`,
    url: "https://theveilpress.gumroad.com/l/riwlqv",
    blurb: "Instant download. Full digital edition of the volume.",
  },
  audiobook: {
    name: "Audiobook",
    price: prices.audiobook,
    label: `Buy Audiobook · ${formatPrice(prices.audiobook)}`,
    url: "https://theveilpress.gumroad.com/l/rphkx",
    blurb: "Full narration. Instant digital delivery.",
  },
  companion: {
    name: "Companion Guide",
    price: prices.companion,
    label: `Get Companion · ${formatPrice(prices.companion)}`,
    url: "https://theveilpress.gumroad.com/l/jawnaq",
    blurb:
      "Apparatus only: glossary, timelines, trees, bibliography, steelman.",
  },
  bundlePrintCompanion: {
    name: "Print + Companion",
    price: prices.bundlePrintCompanion,
    label: `Print + Companion · ${formatPrice(prices.bundlePrintCompanion)}`,
    url: "",
    blurb:
      "Paperback plus Companion Guide. Print full price; Companion 20% off.",
  },
  bundleEbookCompanion: {
    name: "Digital Edition + Companion",
    price: prices.bundleEbookCompanion,
    label: `Digital + Companion · ${formatPrice(prices.bundleEbookCompanion)}`,
    url: "https://theveilpress.gumroad.com/l/tkfupm",
    blurb:
      "Digital Edition plus Companion Guide. Digital full price; Companion 20% off.",
  },
  bundleAudioCompanion: {
    name: "Audiobook + Companion",
    price: prices.bundleAudioCompanion,
    label: `Audio + Companion · ${formatPrice(prices.bundleAudioCompanion)}`,
    url: "https://theveilpress.gumroad.com/l/mghiaq",
    blurb:
      "Audiobook plus Companion Guide. Audiobook full price; Companion 20% off.",
  },
  bundleEbookAudio: {
    name: "Digital Edition + Audiobook",
    price: prices.bundleEbookAudio,
    label: `Digital + Audio · ${formatPrice(prices.bundleEbookAudio)}`,
    url: "https://theveilpress.gumroad.com/l/ggmum",
    blurb:
      "Digital Edition and audiobook. Digital full price; audiobook 20% off.",
  },
  bundleEbookAudioCompanion: {
    name: "Digital Edition + Audiobook + Companion",
    price: prices.bundleEbookAudioCompanion,
    label: `Digital + Audio + Companion · ${formatPrice(prices.bundleEbookAudioCompanion)}`,
    url: "https://theveilpress.gumroad.com/l/obsuvc",
    blurb:
      "Digital Edition, audiobook, and Companion. Digital full price; add-ons 20% off.",
  },
  bundleFull: {
    name: "Full Bundle",
    price: prices.bundleFull,
    label: `Full Bundle · ${formatPrice(prices.bundleFull)}`,
    url: "",
    blurb:
      "Print + Digital Edition + audiobook + Companion Guide. Print full price; each add-on 25% off.",
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

/** True when any product has a live checkout URL. */
export function anyCheckoutReady() {
  return Object.values(products).some((p) => hasUrl(p.url));
}

export default commerce;
