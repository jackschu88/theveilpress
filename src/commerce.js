/**
 * The Veil Press — storefront
 * ---------------------------
 * Source of truth: live Gumroad products (dashboard prices + URLs).
 * Do not invent SKUs. Granny on the Go is intentionally excluded.
 *
 * PRESALE (order now through 26 August 2026):
 *   Softcover, Hardcover, Founders Edition, Limited Founders Edition only.
 *
 * COMING August 26, 2026 (not for sale yet):
 *   All digital SKUs (ebook, audiobook, digital bundles) and Companion Guide.
 *   Limited Founders still includes digital as part of that package.
 *
 * Live catalog (Gumroad checkout totals; soft/hard/companion bake in $5 ship):
 *   Softcover .............. $39.99 + $5 ship = $44.99  l/jiytnb  ← PRESALE
 *   Hardcover .............. $46.99 + $5 ship = $51.99  l/pntwl   ← PRESALE
 *   Digital Edition ........ $15.99  l/riwlqv  ← COMING Aug 26
 *   Audiobook .............. $17.99  l/rphkx   ← COMING Aug 26
 *   Companion hardcover .... $54.99 + $5 ship = $59.99  l/jawnaq  ← COMING Aug 26
 *   Founders Edition ....... $64.99  l/jnnnft  ← PRESALE
 *   Limited Founders ....... $129.99 l/uehrv   ← PRESALE (free ship)
 *   Digital + Companion .... $34.99  l/tkfupm  ← COMING Aug 26
 *   Digital + Audiobook .... $34.99  l/ggmum   ← COMING Aug 26
 *   Audio + Companion ...... $36.99  l/mghiaq  ← COMING Aug 26
 *   Digital + Audio + Comp . $49.99  l/obsuvc  ← COMING Aug 26
 *
 * Site displays product price without shipping for soft/hard/companion,
 * then “Plus $5 shipping.” Gumroad still charges the full baked-in total.
 */

/** Inclusive end of the Volume I print/founders presale window (UTC date). */
export const PRESALE_ENDS = "2026-08-26";
export const PRESALE_ENDS_LABEL = "August 26, 2026";

/** User-facing label for digital / companion SKUs not yet on sale. */
export const COMING_LABEL = "Coming August 26th";
export const COMING_SHORT = "Coming August 26th";

/** True while today (local) is on or before PRESALE_ENDS. */
export function isPresaleActive(now = new Date()) {
  const end = new Date(`${PRESALE_ENDS}T23:59:59`);
  return now.getTime() <= end.getTime();
}

export const PRESALE_BANNER =
  "Softcover, hardcover, and Founders editions on presale through August 26, 2026. Digital formats and Companion Guide: Coming August 26th.";

/**
 * saleStatus:
 *   "presale" — buyable now (print + both Founders)
 *   "coming"  — Coming August 26th (digital + companion + digital bundles)
 *
 * @typedef {{ url: string, price: number, label: string, name: string, blurb: string, path?: string, checkout?: "external" | "hybrid", shippingNote?: string, saleStatus?: "presale" | "coming" }} Product
 * @typedef {{ id: string, channel: "ingram" | "gumroad", title: string, detail: string, price: number, url: string, label: string, saleStatus?: "presale" | "coming" }} CheckoutStep
 * @typedef {{ id: string, path: string, name: string, price: number, blurb: string, steps: CheckoutStep[] }} HybridPlan
 */

/** True when this SKU can be purchased now. */
export function isOnPresale(product) {
  return Boolean(product && product.saleStatus === "presale");
}

/** True when this SKU is announced only (Coming August 26th). */
export function isComingSoon(product) {
  return Boolean(product && product.saleStatus === "coming");
}

/** CTA label: pre-order string or Coming August 26th. */
export function productCtaLabel(product) {
  if (!product) return COMING_LABEL;
  if (product.saleStatus === "coming") return COMING_LABEL;
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

/** Flat shipping added at Gumroad for softcover, hardcover, and Companion. */
export const SHIPPING_FEE = 5;
export const SHIPPING_NOTE = "Plus $5 shipping";
export const FREE_SHIPPING_NOTE = "Free shipping";

/**
 * Site display prices (product only).
 * Softcover / hardcover / Companion: Gumroad checkout = price + SHIPPING_FEE.
 */
export const STANDALONE = {
  softcover: 39.99,
  hardcover: 46.99,
  /** @deprecated use softcover — kept for older imports */
  print: 39.99,
  ebook: 15.99,
  audiobook: 17.99,
  /** Companion Guide hardcover (live SKU) */
  companion: 54.99,
  companionHardcover: 54.99,
  foundersSignedHardcover: 64.99,
  limitedFounders: 129.99,
};

/** Full amount charged on Gumroad (includes baked-in shipping where applicable). */
export const GUMROAD_CHECKOUT_TOTAL = {
  softcover: money(STANDALONE.softcover + SHIPPING_FEE), // 44.99
  hardcover: money(STANDALONE.hardcover + SHIPPING_FEE), // 51.99
  companion: money(STANDALONE.companion + SHIPPING_FEE), // 59.99
  companionHardcover: money(STANDALONE.companionHardcover + SHIPPING_FEE), // 59.99
  foundersSignedHardcover: STANDALONE.foundersSignedHardcover,
  limitedFounders: STANDALONE.limitedFounders,
  ebook: STANDALONE.ebook,
  audiobook: STANDALONE.audiobook,
};

/** Gumroad URLs — live product links only. */
export const GUMROAD = {
  softcover: "https://theveilpress.gumroad.com/l/jiytnb",
  hardcover: "https://theveilpress.gumroad.com/l/pntwl",
  ebook: "https://theveilpress.gumroad.com/l/riwlqv",
  audiobook: "https://theveilpress.gumroad.com/l/rphkx",
  companionHardcover: "https://theveilpress.gumroad.com/l/jawnaq",
  /** Alias used by products.companion */
  companion: "https://theveilpress.gumroad.com/l/jawnaq",
  foundersEdition: "https://theveilpress.gumroad.com/l/jnnnft",
  limitedFounders: "https://theveilpress.gumroad.com/l/uehrv",
  bundleEbookCompanion: "https://theveilpress.gumroad.com/l/tkfupm",
  bundleEbookAudio: "https://theveilpress.gumroad.com/l/ggmum",
  bundleAudioCompanion: "https://theveilpress.gumroad.com/l/mghiaq",
  bundleEbookAudioCompanion: "https://theveilpress.gumroad.com/l/obsuvc",
  fullDigitalUnlock: "https://theveilpress.gumroad.com/l/obsuvc",
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
  foundersEdition: STANDALONE.foundersSignedHardcover,
  limitedFounders: STANDALONE.limitedFounders,
  bundleEbookCompanion: 34.99,
  bundleEbookAudio: 34.99,
  bundleAudioCompanion: 36.99,
  bundleEbookAudioCompanion: 49.99,
  /** Softcover + companion hardcover as two Gumroad steps */
  bundlePrintCompanion: money(STANDALONE.softcover + STANDALONE.companionHardcover),
  /** Softcover + digital triple as two steps (or use Limited Founders as all-in) */
  bundleFull: STANDALONE.limitedFounders,
  fullDigitalPack: 49.99,
  companionAddon: STANDALONE.companionHardcover,
};

/** @type {Record<string, HybridPlan>} */
export const hybridPlans = {
  full: {
    id: "full",
    path: "/books/square-mile/checkout/full",
    name: "Full Bundle",
    price: prices.bundleFull,
    blurb:
      "Prefer one cart? Pre-order Limited Founders Edition (includes digital). Softcover is on presale; the standalone digital set is Coming August 26th.",
    steps: [
      {
        id: "print",
        channel: "gumroad",
        title: "Pre-order softcover print",
        detail: `Trade paperback via Gumroad. ${formatPrice(prices.softcover)} + $${SHIPPING_FEE} shipping. On presale now.`,
        price: prices.softcover,
        url: GUMROAD.softcover,
        label: `Pre-order softcover · ${formatPrice(prices.softcover)}`,
        saleStatus: "presale",
      },
      {
        id: "digital",
        channel: "gumroad",
        title: "Digital set",
        detail:
          "Digital Edition + audiobook + Companion Guide — Coming August 26th (not on presale).",
        price: prices.fullDigitalPack,
        url: GUMROAD.fullDigitalUnlock,
        label: COMING_LABEL,
        saleStatus: "coming",
      },
    ],
  },
  "print-companion": {
    id: "print-companion",
    path: "/books/square-mile/checkout/print-companion",
    name: "Print + Companion",
    price: prices.bundlePrintCompanion,
    blurb:
      "Softcover is on presale now. Companion Guide is Coming August 26th — pre-order softcover alone, or get both via Limited Founders.",
    steps: [
      {
        id: "print",
        channel: "gumroad",
        title: "Pre-order softcover print",
        detail: `Trade paperback via Gumroad. ${formatPrice(prices.softcover)} + $${SHIPPING_FEE} shipping. Presale through August 26, 2026.`,
        price: prices.softcover,
        url: GUMROAD.softcover,
        label: `Pre-order softcover · ${formatPrice(prices.softcover)}`,
        saleStatus: "presale",
      },
      {
        id: "companion",
        channel: "gumroad",
        title: "Companion hardcover",
        detail: `Hardcover companion guide. ${formatPrice(prices.companionHardcover)} + $${SHIPPING_FEE} shipping. Coming August 26th.`,
        price: prices.companionHardcover,
        url: GUMROAD.companionHardcover,
        label: COMING_LABEL,
        saleStatus: "coming",
      },
    ],
  },
};

/** @type {Record<string, Product>} */
export const products = {
  softcover: {
    name: "Softcover Edition",
    price: prices.softcover,
    label: `Pre-order Softcover · ${formatPrice(prices.softcover)}`,
    url: GUMROAD.softcover,
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Trade paperback. Plus $${SHIPPING_FEE} shipping.`,
    shippingNote: SHIPPING_NOTE,
    checkout: "external",
    saleStatus: "presale",
  },
  hardcover: {
    name: "Hardcover Edition",
    price: prices.hardcover,
    label: `Pre-order Hardcover · ${formatPrice(prices.hardcover)}`,
    url: GUMROAD.hardcover,
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Hardcover edition. Plus $${SHIPPING_FEE} shipping.`,
    shippingNote: SHIPPING_NOTE,
    checkout: "external",
    saleStatus: "presale",
  },
  /** Alias: default “print” = softcover (most common) */
  print: {
    name: "Softcover Edition",
    price: prices.softcover,
    label: `Pre-order Softcover · ${formatPrice(prices.softcover)}`,
    url: GUMROAD.softcover,
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Trade paperback. Plus $${SHIPPING_FEE} shipping.`,
    shippingNote: SHIPPING_NOTE,
    checkout: "external",
    saleStatus: "presale",
  },
  ebook: {
    name: "Digital Edition",
    price: prices.ebook,
    label: COMING_LABEL,
    url: GUMROAD.ebook,
    blurb: `${COMING_LABEL}. Full digital edition — not on presale. Want digital now? Limited Founders includes the full digital set.`,
    checkout: "external",
    saleStatus: "coming",
  },
  audiobook: {
    name: "Audiobook",
    price: prices.audiobook,
    label: COMING_LABEL,
    url: GUMROAD.audiobook,
    blurb: `${COMING_LABEL}. Full narration — not on presale. Included in Limited Founders.`,
    checkout: "external",
    saleStatus: "coming",
  },
  companion: {
    name: "Companion Guide (Hardcover)",
    price: prices.companion,
    label: COMING_LABEL,
    url: GUMROAD.companionHardcover,
    blurb: `${COMING_LABEL}. Hardcover apparatus: glossary, timelines, trees, bibliography, steelman. Plus $${SHIPPING_FEE} shipping. Not on standalone presale — included (signed) in Limited Founders.`,
    shippingNote: SHIPPING_NOTE,
    checkout: "external",
    saleStatus: "coming",
  },
  foundersEdition: {
    name: "Founders Edition",
    price: prices.foundersEdition,
    label: `Pre-order Founders · ${formatPrice(prices.foundersEdition)}`,
    url: GUMROAD.foundersEdition,
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Signed hardcover of The Veil of the Square Mile. Includes $5 shipping.`,
    shippingNote: "Includes $5 shipping",
    checkout: "external",
    saleStatus: "presale",
  },
  limitedFounders: {
    name: "Limited Founders Edition",
    price: prices.limitedFounders,
    label: `Pre-order Limited Founders · ${formatPrice(prices.limitedFounders)}`,
    url: GUMROAD.limitedFounders,
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Signed hardcover book + signed hardcover Companion + all digital. Numbered. Free shipping.`,
    shippingNote: FREE_SHIPPING_NOTE,
    checkout: "external",
    saleStatus: "presale",
  },
  bundlePrintCompanion: {
    name: "Softcover + Companion",
    price: prices.bundlePrintCompanion,
    label: COMING_LABEL,
    url: "",
    path: hybridPlans["print-companion"].path,
    checkout: "hybrid",
    blurb: `Softcover is on presale alone. Companion Guide is ${COMING_LABEL}. Or pre-order Limited Founders for both (signed) plus digital.`,
    shippingNote: SHIPPING_NOTE,
    saleStatus: "coming",
  },
  bundleEbookCompanion: {
    name: "Digital Edition + Companion Guide",
    price: prices.bundleEbookCompanion,
    label: COMING_LABEL,
    url: GUMROAD.bundleEbookCompanion,
    checkout: "external",
    blurb: `${COMING_LABEL}. Digital Edition plus Companion Guide — not on presale.`,
    saleStatus: "coming",
  },
  bundleAudioCompanion: {
    name: "Audiobook + Companion",
    price: prices.bundleAudioCompanion,
    label: COMING_LABEL,
    url: GUMROAD.bundleAudioCompanion,
    checkout: "external",
    blurb: `${COMING_LABEL}. Audiobook plus Companion Guide — not on presale.`,
    saleStatus: "coming",
  },
  bundleEbookAudio: {
    name: "Digital Edition + Audiobook",
    price: prices.bundleEbookAudio,
    label: COMING_LABEL,
    url: GUMROAD.bundleEbookAudio,
    checkout: "external",
    blurb: `${COMING_LABEL}. Digital Edition and audiobook — not on presale.`,
    saleStatus: "coming",
  },
  bundleEbookAudioCompanion: {
    name: "Digital Edition + Audiobook + Companion Guide",
    price: prices.bundleEbookAudioCompanion,
    label: COMING_LABEL,
    url: GUMROAD.bundleEbookAudioCompanion,
    checkout: "external",
    blurb: `${COMING_LABEL}. Full digital set — not on presale. Limited Founders includes this plus signed hardcovers.`,
    saleStatus: "coming",
  },
  /** All-in live SKU = Limited Founders (not a computed hybrid). */
  bundleFull: {
    name: "Limited Founders Edition",
    price: prices.limitedFounders,
    label: `Pre-order Limited Founders · ${formatPrice(prices.limitedFounders)}`,
    url: GUMROAD.limitedFounders,
    checkout: "external",
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Complete set: signed hardcover book + signed hardcover Companion + all digital. Free shipping.`,
    shippingNote: FREE_SHIPPING_NOTE,
    saleStatus: "presale",
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
 * Presale list — same live Gumroad catalog.
 */
export const PRESALE_LIST = {
  softcover: STANDALONE.softcover,
  hardcover: STANDALONE.hardcover,
  companionHardcover: STANDALONE.companionHardcover,
  foundersSignedHardcover: STANDALONE.foundersSignedHardcover,
  ebook: STANDALONE.ebook,
  audiobook: STANDALONE.audiobook,
  companionPdf: STANDALONE.ebook, // no separate PDF SKU on Gumroad; digital is riwlqv
};

/**
 * Limited Founders — cost if each piece is bought separately.
 *
 *   Founders Edition (signed HC book) ........ $64.99  (Gumroad total)
 *   Companion Guide hardcover ................ $54.99 + $5 shipping = $59.99
 *   Digital Edition (ebook) .................. $15.99
 *   Audiobook ................................ $17.99
 *   ─────────────────────────────────────────────────
 *   Total separately ......................... $158.96
 *   Limited Founders Edition ................. $129.99  (free shipping)
 *   You save ................................. $28.97
 *
 * Bonuses with no solo SKU (personal message, companion extension, numbered)
 * are listed as included only.
 *
 * @typedef {{ item: string, solo: number | null, detail?: string }} ValueStackItem
 * @type {ValueStackItem[]}
 */
export const EXECUTIVE_VALUE_STACK = [
  {
    item: "Founders Edition (signed hardcover book)",
    solo: STANDALONE.foundersSignedHardcover,
    detail: "Includes $5 shipping",
  },
  {
    item: "Companion Guide (hardcover)",
    // Site list $54.99 + $5 shipping = full Gumroad checkout
    solo: money(STANDALONE.companionHardcover + SHIPPING_FEE),
    detail: `${formatPrice(STANDALONE.companionHardcover)} + $${SHIPPING_FEE} shipping`,
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
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Trade paperback. Plus $${SHIPPING_FEE} shipping.`,
    shippingNote: SHIPPING_NOTE,
    saleStatus: "presale",
  },
  hardcover: {
    name: "Hardcover Book",
    price: PRESALE_LIST.hardcover,
    url: GUMROAD.hardcover,
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Hardcover edition. Plus $${SHIPPING_FEE} shipping.`,
    shippingNote: SHIPPING_NOTE,
    saleStatus: "presale",
  },
  companionHardcover: {
    name: "Companion Guide (Hardcover)",
    price: PRESALE_LIST.companionHardcover,
    url: GUMROAD.companionHardcover,
    blurb: `${COMING_LABEL}. Plus $${SHIPPING_FEE} shipping. Not on standalone presale — included (signed) in Limited Founders.`,
    shippingNote: SHIPPING_NOTE,
    saleStatus: "coming",
  },
  foundersPack: {
    name: "Founders Edition",
    price: PRESALE_LIST.foundersSignedHardcover,
    url: GUMROAD.foundersEdition,
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Signed hardcover. Includes $5 shipping.`,
    shippingNote: "Includes $5 shipping",
    saleStatus: "presale",
  },
  executiveFounderPack: {
    name: "Limited Founders Edition",
    price: EXECUTIVE_PRICE,
    url: GUMROAD.limitedFounders,
    blurb: `Presale through ${PRESALE_ENDS_LABEL}. Signed hardcover book + signed hardcover Companion + all digital. Free shipping.`,
    shippingNote: FREE_SHIPPING_NOTE,
    saleStatus: "presale",
  },
  companionPdf: {
    name: "Digital Edition",
    price: PRESALE_LIST.ebook,
    url: GUMROAD.ebook,
    blurb: `${COMING_LABEL}. Standalone digital is not on presale.`,
    saleStatus: "coming",
  },
};

export function presaleLabel(name, price) {
  return `Pre-order ${name} · $${price.toFixed(2)}`;
}

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
      bundleUrl: products.limitedFounders.url,
      bundleLabel: products.limitedFounders.label,
      bundlePrice: products.limitedFounders.price,
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

export function anyCheckoutReady() {
  return (
    Object.values(products).some((p) => hasUrl(p.url)) ||
    Object.values(hybridPlans).some((plan) =>
      plan.steps.some((s) => hasUrl(s.url))
    )
  );
}

export default commerce;
