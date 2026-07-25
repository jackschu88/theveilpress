/**
 * The Veil Press — storefront
 * ---------------------------
 * Digital SKUs → Gumroad.
 * Print book → IngramSpark (or linked retail).
 * Hybrid bundles (print + digital) use an on-site guided checkout path
 * with two external steps — one cart cannot span both platforms.
 *
 * Gumroad product URL shape:
 *   https://YOURNAME.gumroad.com/l/PRODUCT-SLUG
 * Optional overlay: append ?wanted=true
 *
 * Standalone:
 *   Print book ............... $42.99  (IngramSpark)
 *   Digital Edition .......... $15.99  (Gumroad)
 *   Audiobook ................ $17.99  (Gumroad)
 *   Companion Guide .......... $24.99  (Gumroad)
 *
 * Bundle pricing:
 *   Main product at full price; each add-on 20% off.
 *   Full (everything) bundle: main full price; each add-on 25% off.
 *   Then each bundle is lowered to a retail .99 price (e.g. $29.99).
 */

/**
 * @typedef {{ url: string, price: number, label: string, name: string, blurb: string, path?: string, checkout?: "external" | "hybrid" }} Product
 * @typedef {{ id: string, channel: "ingram" | "gumroad", title: string, detail: string, price: number, url: string, label: string }} CheckoutStep
 * @typedef {{ id: string, path: string, name: string, price: number, blurb: string, steps: CheckoutStep[] }} HybridPlan
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

/** Sum of add-on portions only (no main), charm-priced. */
export function storeAddonPackPrice(addonListPrices, addonRate = ADDON_RATE) {
  const raw = addonListPrices.reduce(
    (sum, p) => sum + money(p * addonRate),
    0
  );
  return charmPrice(raw);
}

/**
 * Print checkout — IngramSpark / retailer.
 * Paste the live IngramSpark (or Amazon/B&N) URL when ready.
 */
export const INGRAM_PRINT_URL = "";

/**
 * Gumroad digital SKUs (instant delivery).
 * Create a dedicated “digital set for print buyers” product if you want
 * the hybrid step price to match the on-site math exactly.
 */
export const GUMROAD = {
  ebook: "https://theveilpress.gumroad.com/l/riwlqv",
  audiobook: "https://theveilpress.gumroad.com/l/rphkx",
  companion: "https://theveilpress.gumroad.com/l/jawnaq",
  bundleEbookCompanion: "https://theveilpress.gumroad.com/l/tkfupm",
  bundleAudioCompanion: "https://theveilpress.gumroad.com/l/mghiaq",
  bundleEbookAudio: "https://theveilpress.gumroad.com/l/ggmum",
  /** Digital Edition + Audiobook + Companion (used as Full Bundle step 2). */
  bundleEbookAudioCompanion: "https://theveilpress.gumroad.com/l/obsuvc",
  /**
   * Optional: dedicated digital unlock for print buyers at hybrid pack price.
   * Falls back to bundleEbookAudioCompanion when empty.
   */
  fullDigitalUnlock: "",
};

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
  /** Digital half of Full Bundle (ebook+audio+companion at 25% off). */
  fullDigitalPack: storeAddonPackPrice(
    [STANDALONE.ebook, STANDALONE.audiobook, STANDALONE.companion],
    FULL_BUNDLE_ADDON_RATE
  ),
  /** Companion as 20% add-on (print + companion hybrid step 2). */
  companionAddon: storeAddonPackPrice([STANDALONE.companion], ADDON_RATE),
};

function gumroadDigitalUnlockUrl() {
  return GUMROAD.fullDigitalUnlock || GUMROAD.bundleEbookAudioCompanion;
}

/** @type {Record<string, HybridPlan>} */
export const hybridPlans = {
  full: {
    id: "full",
    path: "/books/square-mile/checkout/full",
    name: "Full Bundle",
    price: prices.bundleFull,
    blurb:
      "Print ships via IngramSpark. Digital Edition, audiobook, and Companion unlock instantly on Gumroad.",
    steps: [
      {
        id: "print",
        channel: "ingram",
        title: "Order the print book",
        detail:
          "Trade paperback through IngramSpark (or linked retail). Ships to you.",
        price: prices.print,
        url: INGRAM_PRINT_URL,
        label: `Order print · ${formatPrice(prices.print)}`,
      },
      {
        id: "digital",
        channel: "gumroad",
        title: "Unlock the digital set",
        detail:
          "Digital Edition + audiobook + Companion Guide — instant download on Gumroad.",
        price: prices.fullDigitalPack,
        url: gumroadDigitalUnlockUrl(),
        label: `Get digital set · ${formatPrice(prices.fullDigitalPack)}`,
      },
    ],
  },
  "print-companion": {
    id: "print-companion",
    path: "/books/square-mile/checkout/print-companion",
    name: "Print + Companion",
    price: prices.bundlePrintCompanion,
    blurb:
      "Paperback via IngramSpark, Companion Guide via Gumroad — two quick checkouts, one complete kit.",
    steps: [
      {
        id: "print",
        channel: "ingram",
        title: "Order the print book",
        detail: "Trade paperback through IngramSpark (or linked retail).",
        price: prices.print,
        url: INGRAM_PRINT_URL,
        label: `Order print · ${formatPrice(prices.print)}`,
      },
      {
        id: "companion",
        channel: "gumroad",
        title: "Get the Companion Guide",
        detail:
          "Apparatus: glossary, timelines, trees, bibliography, steelman. Instant on Gumroad.",
        price: prices.companionAddon,
        url: GUMROAD.companion,
        label: `Get Companion · ${formatPrice(prices.companionAddon)}`,
      },
    ],
  },
};

/** @type {Record<string, Product>} */
export const products = {
  print: {
    name: "Print Book",
    price: prices.print,
    label: `Buy Print · ${formatPrice(prices.print)}`,
    url: INGRAM_PRINT_URL,
    blurb: "Trade paperback via IngramSpark. Ships to you.",
    checkout: "external",
  },
  ebook: {
    name: "Digital Edition",
    price: prices.ebook,
    label: `Buy Digital Edition · ${formatPrice(prices.ebook)}`,
    url: GUMROAD.ebook,
    blurb: "Instant download. Full digital edition of the volume.",
    checkout: "external",
  },
  audiobook: {
    name: "Audiobook",
    price: prices.audiobook,
    label: `Buy Audiobook · ${formatPrice(prices.audiobook)}`,
    url: GUMROAD.audiobook,
    blurb: "Full narration. Instant digital delivery.",
    checkout: "external",
  },
  companion: {
    name: "Companion Guide",
    price: prices.companion,
    label: `Get Companion · ${formatPrice(prices.companion)}`,
    url: GUMROAD.companion,
    blurb:
      "Apparatus only: glossary, timelines, trees, bibliography, steelman.",
    checkout: "external",
  },
  bundlePrintCompanion: {
    name: "Print + Companion",
    price: prices.bundlePrintCompanion,
    label: `Print + Companion · ${formatPrice(prices.bundlePrintCompanion)}`,
    url: "",
    path: hybridPlans["print-companion"].path,
    checkout: "hybrid",
    blurb:
      "Print via IngramSpark + Companion on Gumroad. Guided two-step checkout.",
  },
  bundleEbookCompanion: {
    name: "Digital Edition + Companion",
    price: prices.bundleEbookCompanion,
    label: `Digital + Companion · ${formatPrice(prices.bundleEbookCompanion)}`,
    url: GUMROAD.bundleEbookCompanion,
    checkout: "external",
    blurb:
      "Digital Edition plus Companion Guide. Digital full price; Companion 20% off.",
  },
  bundleAudioCompanion: {
    name: "Audiobook + Companion",
    price: prices.bundleAudioCompanion,
    label: `Audio + Companion · ${formatPrice(prices.bundleAudioCompanion)}`,
    url: GUMROAD.bundleAudioCompanion,
    checkout: "external",
    blurb:
      "Audiobook plus Companion Guide. Audiobook full price; Companion 20% off.",
  },
  bundleEbookAudio: {
    name: "Digital Edition + Audiobook",
    price: prices.bundleEbookAudio,
    label: `Digital + Audio · ${formatPrice(prices.bundleEbookAudio)}`,
    url: GUMROAD.bundleEbookAudio,
    checkout: "external",
    blurb:
      "Digital Edition and audiobook. Digital full price; audiobook 20% off.",
  },
  bundleEbookAudioCompanion: {
    name: "Digital Edition + Audiobook + Companion",
    price: prices.bundleEbookAudioCompanion,
    label: `Digital + Audio + Companion · ${formatPrice(prices.bundleEbookAudioCompanion)}`,
    url: GUMROAD.bundleEbookAudioCompanion,
    checkout: "external",
    blurb:
      "Digital Edition, audiobook, and Companion. Digital full price; add-ons 20% off.",
  },
  bundleFull: {
    name: "Full Bundle",
    price: prices.bundleFull,
    label: `Full Bundle · ${formatPrice(prices.bundleFull)}`,
    url: "",
    path: hybridPlans.full.path,
    checkout: "hybrid",
    blurb:
      "Print (IngramSpark) + all digital (Gumroad). Guided two-step checkout — print full price; digital add-ons 25% off.",
  },
};

/** True when product uses the multi-step hybrid path. */
export function isHybridProduct(product) {
  return Boolean(product && product.checkout === "hybrid" && product.path);
}

/** Resolve hybrid plan by product or plan id. */
export function getHybridPlan(productOrId) {
  if (!productOrId) return null;
  if (typeof productOrId === "string") {
    return hybridPlans[productOrId] || null;
  }
  if (productOrId.path) {
    return (
      Object.values(hybridPlans).find((p) => p.path === productOrId.path) ||
      null
    );
  }
  return null;
}

/**
 * Value breakdown for the Limited Founders Edition — solo list prices.
 * Pack includes: signed hardcover book + signed hardcover companion + all digital.
 */
export const EXECUTIVE_VALUE_STACK = [
  { item: "Hardcover Book (signed)", solo: 45.99 },
  { item: "Hardcover Companion Guide (signed)", solo: 69.99 },
  { item: "Digital Edition (ebook)", solo: 15.99 },
  { item: "Audiobook", solo: 17.99 },
  { item: "Companion Guide (PDF)", solo: 24.99 },
  { item: "Personal message", solo: null },
  { item: "Companion extension (bonus chapter)", solo: null },
  { item: "Numbered edition", solo: null },
];

export const EXECUTIVE_TOTAL_SOLO = EXECUTIVE_VALUE_STACK.reduce(
  (sum, v) => sum + (v.solo || 0), 0
);

/** Limited Founders Edition pack price. */
export const EXECUTIVE_PRICE = 124.99;

/**
 * Presale products — live at /presale.
 * Fill in Gumroad URLs when ready. Empty URLs show "Pre-order link pending".
 *
 * Founders Edition ........ $59.99  signed hardcover book only (Gumroad live)
 * Limited Founders Edition  $124.99 signed hardcover + signed companion HC + all digital
 */
export const PRESALE = {
  softcover: { name: "Softcover Book", price: 39.99, url: "", blurb: "Trade paperback. Pre-order the first volume." },
  hardcover: { name: "Hardcover Book", price: 45.99, url: "", blurb: "Hardcover edition. Pre-order the first volume." },
  companionPdf: { name: "Companion Guide (PDF)", price: 24.99, url: "", blurb: "Digital companion guide. Glossary, timelines, bibliography, steelman. Delivered on release." },
  companionHardcover: { name: "Companion Guide (Hardcover)", price: 69.99, url: "", blurb: "Hardcover companion guide. The apparatus for the main volume." },
  foundersPack: {
    name: "Founders Edition",
    price: 59.99,
    url: "https://theveilpress.gumroad.com/l/jnnnft",
    blurb: "Signed hardcover of The Veil of the Square Mile. Special presale price.",
  },
  /** Alias kept as executiveFounderPack for existing page imports. */
  executiveFounderPack: {
    name: "Limited Founders Edition",
    price: EXECUTIVE_PRICE,
    url: "https://theveilpress.gumroad.com/l/uehrv",
    blurb:
      "Signed hardcover book + signed hardcover Companion Guide + all digital (ebook, audiobook, Companion PDF). Numbered limited edition.",
  },
};

export function presaleLabel(name, price) {
  return `Pre-order ${name} · $${price.toFixed(2)}`;
}

const commerce = {
  products,
  hybridPlans,

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
      bundleUrl: products.bundleFull.path || products.bundleFull.url,
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
  return (
    Object.values(products).some((p) => hasUrl(p.url)) ||
    Object.values(hybridPlans).some((plan) =>
      plan.steps.some((s) => hasUrl(s.url))
    )
  );
}

export default commerce;
