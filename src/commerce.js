/**
 * The Veil Press — storefront
 * ---------------------------
 * Source of truth: live Gumroad products (dashboard prices + URLs).
 * Do not invent SKUs. Granny on the Go is intentionally excluded.
 *
 * LIVE (presale ended 26 August 2026):
 *   Softcover, hardcover, signed hardcover (short run of 25),
 *   Companion Guide hardcover (ships in about one week),
 *   Hardcover + Companion Guide bundle,
 *   Digital SKUs (ebook, audiobook, digital bundles).
 *
 * PUBLIC GRID does not show Founders Edition or Limited Founders.
 * Those SKUs remain in Gumroad for paid orders already placed.
 *
 * Live catalog (Gumroad checkout totals; soft/hard bake in $5 ship, companion $10,
 * hardcover+companion bundle bakes in $15 ship):
 *   Softcover .............. $39.99 + $5 ship = $44.99  l/jiytnb
 *   Hardcover .............. $46.99 + $5 ship = $51.99  l/pntwl
 *   Signed hardcover ....... $64.99 (includes $5 ship)  l/jnnnft
 *   Digital Edition ........ $15.99  l/riwlqv
 *   Audiobook .............. $17.99  l/rphkx
 *   Companion hardcover .... $59.99 + $10 ship = $69.99  l/jawnaq
 *   Hardcover + Companion .. $104.99 + $15 ship = $119.99  l/qhzsbx
 *   Digital + Companion .... $34.99  l/tkfupm
 *   Digital + Audiobook .... $34.99  l/ggmum
 *   Audio + Companion ...... $36.99  l/mghiaq
 *   Digital + Audio + Comp . $49.99  l/obsuvc
 *
 * Site displays product price without shipping,
 * then shipping note. Gumroad charges the full baked-in total.
 * Signed hardcover uses the existing Founders checkout total ($64.99).
 *
 * No standalone Companion PDF SKU on Gumroad. Companion PDF is sold
 * inside the digital bundles (tkfupm / mghiaq / obsuvc).
 */

/** Historical: inclusive end of the Volume I print/founders presale window. */
export const PRESALE_ENDS = "2026-08-26";
export const PRESALE_ENDS_LABEL = "August 26, 2026";

/** Digital is live. Kept so leftover imports never print a close date. */
export const COMING_LABEL = "Available now";
export const COMING_SHORT = "Available now";

/** Presale window has closed. Always false. */
export function isPresaleActive(_now = new Date()) {
  return false;
}

export const LIVE_BANNER =
  "Softcover and hardcover of The Veil of the Square Mile ship now. Signed hardcover is a short run. The Companion Guide hardcover follows in about a week. Digital editions are available immediately.";

export const PRESALE_BANNER = LIVE_BANNER;

/**
 * saleStatus:
 *   "live"   — buyable now
 *   "closed" — seed-run SKU kept for existing orders, not on the public grid
 *
 * @typedef {{ url: string, price: number, label: string, name: string, blurb: string, path?: string, checkout?: "external" | "hybrid", shippingNote?: string, deliveryNote?: string, badge?: string, saleStatus?: "live" | "closed" | "presale" | "coming" }} Product
 * @typedef {{ id: string, channel: "ingram" | "gumroad", title: string, detail: string, price: number, url: string, label: string, saleStatus?: "live" | "closed" | "presale" | "coming" }} CheckoutStep
 * @typedef {{ id: string, path: string, name: string, price: number, blurb: string, steps: CheckoutStep[] }} HybridPlan
 */

const INSTANT_DOWNLOAD = "Instant download after purchase.";
const SHIPS_NOW = "In stock. Ships now.";
const SIGNED_SHIPS_NOW = "In stock. Ships now. Signed before ship.";
const COMPANION_DELAY =
  "Ships in about one week. You will get confirmation when it goes out.";
const BUNDLE_DELAY =
  "Book ships now. Companion hardcover follows in about one week.";

/** True when this SKU can be purchased now. */
export function isOnPresale(product) {
  return Boolean(product && (product.saleStatus === "live" || product.saleStatus === "presale"));
}

/** Coming-soon gate is off — every public SKU is for sale. */
export function isComingSoon(_product) {
  return false;
}

/** CTA label from the product itself. */
export function productCtaLabel(product) {
  if (!product) return "Buy";
  return product.label;
}

/** Round money to cents. */
export function money(n) {
  return Math.round(n * 100) / 100;
}

export function formatPrice(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return "";
  return `$${n.toFixed(2)}`;
}

/** Flat shipping added at Gumroad for softcover, hardcover. Companion uses $10. Bundle uses $15. */
export const SHIPPING_FEE = 5;
export const COMPANION_SHIPPING_FEE = 10;
/** Hardcover + Companion Guide physical bundle shipping (baked into Gumroad $119.99). */
export const HARDCOVER_BUNDLE_SHIPPING_FEE = 15;
export const SHIPPING_NOTE = "Plus $5 shipping";
export const COMPANION_SHIPPING_NOTE = "Plus $10 shipping";
export const HARDCOVER_BUNDLE_SHIPPING_NOTE = "Plus $15 shipping";
export const FREE_SHIPPING_NOTE = "Free shipping";

/**
 * Site display prices (product only).
 * Softcover / hardcover / Companion: Gumroad checkout = price + shipping.
 * Hardcover + Companion bundle: Gumroad = $104.99 + $15 shipping = $119.99.
 * Signed hardcover: Gumroad total $64.99 (existing Founders checkout).
 */
export const STANDALONE = {
  softcover: 39.99,
  hardcover: 46.99,
  /** @deprecated use softcover — kept for older imports */
  print: 39.99,
  ebook: 15.99,
  audiobook: 17.99,
  /** Companion Guide hardcover (live SKU — $59.99 product + $10 shipping = $69.99 Gumroad) */
  companion: 59.99,
  companionHardcover: 59.99,
  /**
   * Hardcover book + Companion hardcover (physical set only).
   * Site: $104.99 + $15 shipping. Gumroad checkout total: $119.99.
   */
  hardcoverCompanionBundle: 104.99,
  /** Same checkout total as the closed Founders Edition SKU. */
  signedHardcover: 64.99,
  foundersSignedHardcover: 64.99,
  limitedFounders: 129.99,
};

/** Full amount charged on Gumroad (includes baked-in shipping where applicable). */
export const GUMROAD_CHECKOUT_TOTAL = {
  softcover: money(STANDALONE.softcover + SHIPPING_FEE), // 44.99
  hardcover: money(STANDALONE.hardcover + SHIPPING_FEE), // 51.99
  companion: money(STANDALONE.companion + COMPANION_SHIPPING_FEE), // 69.99
  companionHardcover: money(STANDALONE.companionHardcover + COMPANION_SHIPPING_FEE), // 69.99
  hardcoverCompanionBundle: money(
    STANDALONE.hardcoverCompanionBundle + HARDCOVER_BUNDLE_SHIPPING_FEE
  ), // 119.99
  signedHardcover: STANDALONE.signedHardcover,
  foundersSignedHardcover: STANDALONE.foundersSignedHardcover,
  limitedFounders: STANDALONE.limitedFounders,
  ebook: STANDALONE.ebook,
  audiobook: STANDALONE.audiobook,
};

/** Gumroad URLs — live product links only. */
export const GUMROAD = {
  softcover: "https://shop.theveilpress.com/l/jiytnb",
  hardcover: "https://shop.theveilpress.com/l/pntwl",
  ebook: "https://shop.theveilpress.com/l/riwlqv",
  audiobook: "https://shop.theveilpress.com/l/rphkx",
  companionHardcover: "https://shop.theveilpress.com/l/jawnaq",
  /** Alias used by products.companion */
  companion: "https://shop.theveilpress.com/l/jawnaq",
  /** Hardcover + Companion Guide physical bundle ($119.99 total on Gumroad). */
  hardcoverCompanionBundle: "https://shop.theveilpress.com/l/qhzsbx",
  /** Signed hardcover — existing Founders Edition checkout. */
  signedHardcover: "https://shop.theveilpress.com/l/jnnnft",
  foundersEdition: "https://shop.theveilpress.com/l/jnnnft",
  limitedFounders: "https://shop.theveilpress.com/l/uehrv",
  bundleEbookCompanion: "https://shop.theveilpress.com/l/tkfupm",
  bundleEbookAudio: "https://shop.theveilpress.com/l/ggmum",
  bundleAudioCompanion: "https://shop.theveilpress.com/l/mghiaq",
  bundleEbookAudioCompanion: "https://shop.theveilpress.com/l/obsuvc",
  fullDigitalUnlock: "https://shop.theveilpress.com/l/obsuvc",
};

/** @deprecated empty Ingram — print is on Gumroad now */
export const INGRAM_PRINT_URL = "";

/** Exact retail prices (Gumroad), not computed stacks. */
const prices = {
  softcover: STANDALONE.softcover,
  hardcover: STANDALONE.hardcover,
  print: STANDALONE.softcover,
  ebook: STANDALONE.ebook,
  audiobook: STANDALONE.audiobook,
  companion: STANDALONE.companion,
  companionHardcover: STANDALONE.companionHardcover,
  hardcoverCompanionBundle: STANDALONE.hardcoverCompanionBundle,
  signedHardcover: STANDALONE.signedHardcover,
  foundersEdition: STANDALONE.foundersSignedHardcover,
  limitedFounders: STANDALONE.limitedFounders,
  bundleEbookCompanion: 34.99,
  bundleEbookAudio: 34.99,
  bundleAudioCompanion: 36.99,
  bundleEbookAudioCompanion: 49.99,
  /** Softcover + companion hardcover as two Gumroad steps */
  bundlePrintCompanion: money(STANDALONE.softcover + STANDALONE.companionHardcover),
  bundleFull: money(STANDALONE.hardcoverCompanionBundle),
  fullDigitalPack: 49.99,
  companionAddon: STANDALONE.companionHardcover,
};

export function buyLabel(name, price) {
  return `Buy ${name} · ${formatPrice(price)}`;
}

/** @deprecated use buyLabel */
export function presaleLabel(name, price) {
  return buyLabel(name, price);
}

/** @type {Record<string, HybridPlan>} */
export const hybridPlans = {
  full: {
    id: "full",
    path: "/books/square-mile/checkout/full",
    name: "Full Bundle",
    price: prices.fullDigitalPack,
    blurb:
      "Digital Edition, audiobook, and Companion Guide PDF in one checkout. Instant download after purchase.",
    steps: [
      {
        id: "print",
        channel: "gumroad",
        title: "Softcover print",
        detail: `Trade paperback via Gumroad. ${formatPrice(prices.softcover)} + $${SHIPPING_FEE} shipping. In stock. Ships now.`,
        price: prices.softcover,
        url: GUMROAD.softcover,
        label: buyLabel("softcover", prices.softcover),
        saleStatus: "live",
      },
      {
        id: "digital",
        channel: "gumroad",
        title: "Digital set",
        detail: "Digital Edition + audiobook + Companion Guide PDF. Instant download after purchase.",
        price: prices.fullDigitalPack,
        url: GUMROAD.fullDigitalUnlock,
        label: buyLabel("digital set", prices.fullDigitalPack),
        saleStatus: "live",
      },
    ],
  },
  "print-companion": {
    id: "print-companion",
    path: "/books/square-mile/checkout/print-companion",
    name: "Print + Companion",
    price: prices.bundlePrintCompanion,
    blurb:
      "Softcover ships now. Companion Guide hardcover follows in about one week (two checkouts). Prefer one cart? The hardcover + Companion bundle is a single checkout.",
    steps: [
      {
        id: "print",
        channel: "gumroad",
        title: "Softcover print",
        detail: `Trade paperback via Gumroad. ${formatPrice(prices.softcover)} + $${SHIPPING_FEE} shipping. In stock. Ships now.`,
        price: prices.softcover,
        url: GUMROAD.softcover,
        label: buyLabel("softcover", prices.softcover),
        saleStatus: "live",
      },
      {
        id: "companion",
        channel: "gumroad",
        title: "Companion hardcover",
        detail: `Hardcover companion guide. ${formatPrice(prices.companionHardcover)} + $${COMPANION_SHIPPING_FEE} shipping. Ships in about one week.`,
        price: prices.companionHardcover,
        url: GUMROAD.companionHardcover,
        label: buyLabel("Companion Hardcover", prices.companionHardcover),
        saleStatus: "live",
      },
    ],
  },
};

/** @type {Record<string, Product>} */
export const products = {
  softcover: {
    name: "Softcover Edition",
    price: prices.softcover,
    label: buyLabel("Softcover", prices.softcover),
    url: GUMROAD.softcover,
    blurb: "The book. Trade paperback, 6×9, 384 pages.",
    shippingNote: SHIPPING_NOTE,
    deliveryNote: SHIPS_NOW,
    badge: "In stock",
    checkout: "external",
    saleStatus: "live",
  },
  hardcover: {
    name: "Hardcover Edition",
    price: prices.hardcover,
    label: buyLabel("Hardcover", prices.hardcover),
    url: GUMROAD.hardcover,
    blurb: "The book in hardcover.",
    shippingNote: SHIPPING_NOTE,
    deliveryNote: SHIPS_NOW,
    badge: "In stock",
    checkout: "external",
    saleStatus: "live",
  },
  /** Alias: default “print” = softcover (most common) */
  print: {
    name: "Softcover Edition",
    price: prices.softcover,
    label: buyLabel("Softcover", prices.softcover),
    url: GUMROAD.softcover,
    blurb: "The book. Trade paperback, 6×9, 384 pages.",
    shippingNote: SHIPPING_NOTE,
    deliveryNote: SHIPS_NOW,
    badge: "In stock",
    checkout: "external",
    saleStatus: "live",
  },
  /**
   * Public signed hardcover card. Checkout is the existing Founders SKU
   * (l/jnnnft, $64.99 including $5 shipping). Not sold as “Founders” on the grid.
   */
  signedHardcover: {
    name: "Signed Hardcover",
    price: prices.signedHardcover,
    label: buyLabel("Signed Hardcover", prices.signedHardcover),
    url: GUMROAD.signedHardcover,
    blurb: "Short run from the 25 on hand. Signed before ship.",
    shippingNote: "Includes $5 shipping",
    deliveryNote: SIGNED_SHIPS_NOW,
    badge: "Short run",
    checkout: "external",
    saleStatus: "live",
  },
  ebook: {
    name: "Ebook",
    price: prices.ebook,
    label: buyLabel("Ebook", prices.ebook),
    url: GUMROAD.ebook,
    blurb: "Full digital edition of the book.",
    deliveryNote: INSTANT_DOWNLOAD,
    badge: "Instant download",
    checkout: "external",
    saleStatus: "live",
  },
  audiobook: {
    name: "Audiobook",
    price: prices.audiobook,
    label: buyLabel("Audiobook", prices.audiobook),
    url: GUMROAD.audiobook,
    blurb: "Full narration.",
    deliveryNote: INSTANT_DOWNLOAD,
    badge: "Instant download",
    checkout: "external",
    saleStatus: "live",
  },
  companion: {
    name: "Companion Guide (Hardcover)",
    price: prices.companion,
    label: buyLabel("Companion Hardcover", prices.companion),
    url: GUMROAD.companionHardcover,
    blurb:
      "The map: sources, timelines, dynastic trees, glossary, bibliography, steelman.",
    shippingNote: COMPANION_SHIPPING_NOTE,
    deliveryNote: COMPANION_DELAY,
    badge: "Ships in about a week",
    checkout: "external",
    saleStatus: "live",
  },
  /**
   * Complete physical set: main book hardcover + Companion hardcover.
   * Site shows $104.99 + $15 shipping; Gumroad charges $119.99.
   */
  hardcoverCompanionBundle: {
    name: "Hardcover + Companion Guide",
    price: prices.hardcoverCompanionBundle,
    label: buyLabel("Hardcover Bundle", prices.hardcoverCompanionBundle),
    url: GUMROAD.hardcoverCompanionBundle,
    blurb: "Hardcover of the book plus the Companion Guide hardcover.",
    shippingNote: HARDCOVER_BUNDLE_SHIPPING_NOTE,
    deliveryNote: BUNDLE_DELAY,
    badge: "Split shipment",
    checkout: "external",
    saleStatus: "live",
  },
  /**
   * Closed public offer. Kept so thank-you / existing-order paths still resolve.
   * Do not put this on the homepage grid.
   */
  foundersEdition: {
    name: "Founders Edition",
    price: prices.foundersEdition,
    label: buyLabel("Founders", prices.foundersEdition),
    url: GUMROAD.foundersEdition,
    blurb: "The Founders seed run is closed. Signed hardcovers remain while the current short run lasts.",
    shippingNote: "Includes $5 shipping",
    deliveryNote: SIGNED_SHIPS_NOW,
    checkout: "external",
    saleStatus: "closed",
  },
  limitedFounders: {
    name: "Limited Founders Edition",
    price: prices.limitedFounders,
    label: `Limited Founders · ${formatPrice(prices.limitedFounders)}`,
    url: GUMROAD.limitedFounders,
    blurb: "The Founders seed run is closed.",
    shippingNote: FREE_SHIPPING_NOTE,
    checkout: "external",
    saleStatus: "closed",
  },
  bundlePrintCompanion: {
    name: "Softcover + Companion",
    price: prices.bundlePrintCompanion,
    label: buyLabel("Print + Companion", prices.bundlePrintCompanion),
    url: "",
    path: hybridPlans["print-companion"].path,
    checkout: "hybrid",
    blurb: "Softcover ships now. Companion hardcover follows in about one week (two checkouts).",
    shippingNote: SHIPPING_NOTE,
    deliveryNote: BUNDLE_DELAY,
    saleStatus: "live",
  },
  bundleEbookCompanion: {
    name: "Ebook + Companion Guide PDF",
    price: prices.bundleEbookCompanion,
    label: buyLabel("Ebook + Companion PDF", prices.bundleEbookCompanion),
    url: GUMROAD.bundleEbookCompanion,
    checkout: "external",
    blurb: "Digital edition plus Companion Guide PDF.",
    deliveryNote: INSTANT_DOWNLOAD,
    badge: "Instant download",
    saleStatus: "live",
  },
  bundleAudioCompanion: {
    name: "Audiobook + Companion",
    price: prices.bundleAudioCompanion,
    label: buyLabel("Audiobook + Companion", prices.bundleAudioCompanion),
    url: GUMROAD.bundleAudioCompanion,
    checkout: "external",
    blurb: "Audiobook plus Companion Guide PDF.",
    deliveryNote: INSTANT_DOWNLOAD,
    badge: "Instant download",
    saleStatus: "live",
  },
  bundleEbookAudio: {
    name: "Ebook + Audiobook",
    price: prices.bundleEbookAudio,
    label: buyLabel("Ebook + Audiobook", prices.bundleEbookAudio),
    url: GUMROAD.bundleEbookAudio,
    checkout: "external",
    blurb: "Digital edition and audiobook together.",
    deliveryNote: INSTANT_DOWNLOAD,
    badge: "Instant download",
    saleStatus: "live",
  },
  bundleEbookAudioCompanion: {
    name: "Ebook + Audiobook + Companion PDF",
    price: prices.bundleEbookAudioCompanion,
    label: buyLabel("Digital complete", prices.bundleEbookAudioCompanion),
    url: GUMROAD.bundleEbookAudioCompanion,
    checkout: "external",
    blurb: "Ebook, audiobook, and Companion Guide PDF.",
    deliveryNote: INSTANT_DOWNLOAD,
    badge: "Instant download",
    saleStatus: "live",
  },
  /** Public all-in digital set (not Limited Founders). */
  bundleFull: {
    name: "Ebook + Audiobook + Companion PDF",
    price: prices.bundleEbookAudioCompanion,
    label: buyLabel("Digital complete", prices.bundleEbookAudioCompanion),
    url: GUMROAD.bundleEbookAudioCompanion,
    checkout: "external",
    blurb: "Ebook, audiobook, and Companion Guide PDF.",
    deliveryNote: INSTANT_DOWNLOAD,
    badge: "Instant download",
    saleStatus: "live",
  },
};

/**
 * Public buy grid — homepage and book page.
 * Founders Edition and Limited Founders are intentionally omitted.
 * No standalone Companion PDF SKU exists; PDF ships inside digital bundles.
 */
export const PUBLIC_GRID = [
  products.softcover,
  products.hardcover,
  products.signedHardcover,
  products.companion,
  products.hardcoverCompanionBundle,
  products.ebook,
  products.audiobook,
  products.bundleEbookAudio,
  products.bundleEbookCompanion,
  products.bundleEbookAudioCompanion,
];

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
 * Live list — same live Gumroad catalog.
 */
export const PRESALE_LIST = {
  softcover: STANDALONE.softcover,
  hardcover: STANDALONE.hardcover,
  companionHardcover: STANDALONE.companionHardcover,
  hardcoverCompanionBundle: STANDALONE.hardcoverCompanionBundle,
  signedHardcover: STANDALONE.signedHardcover,
  foundersSignedHardcover: STANDALONE.foundersSignedHardcover,
  ebook: STANDALONE.ebook,
  audiobook: STANDALONE.audiobook,
  companionPdf: STANDALONE.ebook, // no separate PDF SKU on Gumroad
};

/**
 * Limited Founders — cost if each piece is bought separately.
 * Kept for existing-order / thank-you math. Not a public offer.
 *
 *   Signed hardcover (Founders SKU) ......... $64.99  (Gumroad total)
 *   Companion Guide hardcover ................ $59.99 + $10 shipping = $69.99
 *   Digital Edition (ebook) .................. $15.99
 *   Audiobook ................................ $17.99
 *   ─────────────────────────────────────────────────
 *   Total separately ......................... $168.96
 *   Limited Founders Edition ................. $129.99  (free shipping)
 *
 * @typedef {{ item: string, solo: number | null, detail?: string }} ValueStackItem
 * @type {ValueStackItem[]}
 */
export const EXECUTIVE_VALUE_STACK = [
  {
    item: "Signed hardcover book",
    solo: STANDALONE.foundersSignedHardcover,
    detail: "Includes $5 shipping",
  },
  {
    item: "Companion Guide (hardcover)",
    solo: money(STANDALONE.companionHardcover + COMPANION_SHIPPING_FEE),
    detail: `${formatPrice(STANDALONE.companionHardcover)} + $${COMPANION_SHIPPING_FEE} shipping`,
  },
  {
    item: "Digital Edition (ebook)",
    solo: STANDALONE.ebook,
  },
  {
    item: "Audiobook",
    solo: STANDALONE.audiobook,
  },
  { item: "Personal message", solo: null },
  { item: "Companion extension (bonus chapter)", solo: null },
  { item: "Numbered edition", solo: null },
];

export const EXECUTIVE_TOTAL_SOLO = money(
  EXECUTIVE_VALUE_STACK.reduce((sum, v) => sum + (v.solo || 0), 0)
);

export const EXECUTIVE_PRICE = STANDALONE.limitedFounders;
export const EXECUTIVE_SAVINGS = money(EXECUTIVE_TOTAL_SOLO - EXECUTIVE_PRICE);
export const EXECUTIVE_SAVINGS_PCT = Math.round(
  (EXECUTIVE_SAVINGS / EXECUTIVE_TOTAL_SOLO) * 100
);

export const PRESALE = {
  softcover: {
    name: "Softcover Book",
    price: PRESALE_LIST.softcover,
    url: GUMROAD.softcover,
    blurb: products.softcover.blurb,
    shippingNote: SHIPPING_NOTE,
    deliveryNote: SHIPS_NOW,
    saleStatus: "live",
  },
  hardcover: {
    name: "Hardcover Book",
    price: PRESALE_LIST.hardcover,
    url: GUMROAD.hardcover,
    blurb: products.hardcover.blurb,
    shippingNote: SHIPPING_NOTE,
    deliveryNote: SHIPS_NOW,
    saleStatus: "live",
  },
  signedHardcover: {
    name: "Signed Hardcover",
    price: PRESALE_LIST.signedHardcover,
    url: GUMROAD.signedHardcover,
    blurb: products.signedHardcover.blurb,
    shippingNote: "Includes $5 shipping",
    deliveryNote: SIGNED_SHIPS_NOW,
    saleStatus: "live",
  },
  companionHardcover: {
    name: "Companion Guide (Hardcover)",
    price: PRESALE_LIST.companionHardcover,
    url: GUMROAD.companionHardcover,
    blurb: products.companion.blurb,
    shippingNote: COMPANION_SHIPPING_NOTE,
    deliveryNote: COMPANION_DELAY,
    saleStatus: "live",
  },
  hardcoverCompanionBundle: {
    name: "Hardcover + Companion Guide",
    price: PRESALE_LIST.hardcoverCompanionBundle,
    url: GUMROAD.hardcoverCompanionBundle,
    blurb: products.hardcoverCompanionBundle.blurb,
    shippingNote: HARDCOVER_BUNDLE_SHIPPING_NOTE,
    deliveryNote: BUNDLE_DELAY,
    saleStatus: "live",
  },
  foundersPack: {
    name: "Founders Edition",
    price: PRESALE_LIST.foundersSignedHardcover,
    url: GUMROAD.foundersEdition,
    blurb: products.foundersEdition.blurb,
    shippingNote: "Includes $5 shipping",
    saleStatus: "closed",
  },
  executiveFounderPack: {
    name: "Limited Founders Edition",
    price: EXECUTIVE_PRICE,
    url: GUMROAD.limitedFounders,
    blurb: products.limitedFounders.blurb,
    shippingNote: FREE_SHIPPING_NOTE,
    saleStatus: "closed",
  },
  companionPdf: {
    name: "Digital Edition",
    price: PRESALE_LIST.ebook,
    url: GUMROAD.ebook,
    blurb: products.ebook.blurb,
    deliveryNote: INSTANT_DOWNLOAD,
    saleStatus: "live",
  },
};

/** Legacy helpers kept for bundle math imports (prefer live prices above). */
export const ADDON_RATE = 0.8;
export const FULL_BUNDLE_ADDON_RATE = 0.75;

export function bundlePrice(listPrices, addonRate = ADDON_RATE) {
  if (!listPrices.length) return 0;
  const [main, ...addons] = listPrices;
  const addonTotal = addons.reduce((sum, p) => sum + money(p * addonRate), 0);
  return money(main + addonTotal);
}

export function charmPrice(n) {
  const cents = Math.round(n * 100);
  if (cents % 100 === 99) return money(n);
  return money(Math.floor(n) - 0.01);
}

export function storeBundlePrice(listPrices, addonRate = ADDON_RATE) {
  return charmPrice(bundlePrice(listPrices, addonRate));
}

export function storeAddonPackPrice(addonListPrices, addonRate = ADDON_RATE) {
  const raw = addonListPrices.reduce(
    (sum, p) => sum + money(p * addonRate),
    0
  );
  return charmPrice(raw);
}

const commerce = {
  products,
  hybridPlans,
  PUBLIC_GRID,

  get squareMile() {
    return {
      printUrl: products.softcover.url,
      ebookUrl: products.ebook.url,
      audiobookUrl: products.audiobook.url,
      printLabel: products.softcover.label,
      ebookLabel: products.ebook.label,
      audiobookLabel: products.audiobook.label,
      printPrice: products.softcover.price,
      ebookPrice: products.ebook.price,
      audiobookPrice: products.audiobook.price,
    };
  },

  get companion() {
    return {
      fullUrl: products.companion.url,
      fullLabel: products.companion.label,
      fullPrice: products.companion.price,
      bundleUrl: products.hardcoverCompanionBundle.url,
      bundleLabel: products.hardcoverCompanionBundle.label,
      bundlePrice: products.hardcoverCompanionBundle.price,
    };
  },

  get bundles() {
    return {
      printCompanion: products.bundlePrintCompanion,
      hardcoverCompanion: products.hardcoverCompanionBundle,
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

export function anyCheckoutReady() {
  return (
    Object.values(products).some((p) => hasUrl(p.url)) ||
    Object.values(hybridPlans).some((plan) =>
      plan.steps.some((s) => hasUrl(s.url))
    )
  );
}

export default commerce;
