/**
 * The Veil Press — purchase links
 * --------------------------------
 * Fill these in when storefronts are live. Leave empty string "" to show
 * "Coming soon" on the site.
 *
 * Recommended stack (hybrid):
 * - Print book  → Amazon KDP product URL
 * - PDF book    → Gumroad / Lemon Squeezy / Stripe Payment Link
 * - Companion   → same platform, two products or one product + coupon
 *
 * Book-buyer Companion paths:
 * - /books/square-mile/companion/print  → companionPrint (auto $5.99)
 * - /books/square-mile/companion/ebook  → companionEbook (auto $5.99)
 * - /books/square-mile/companion        → companionFull ($19.99) + buyer options
 */

const commerce = {
  squareMile: {
    /** Amazon (or Bookshop) paperback / hardcover */
    printUrl: "",
    /** Direct PDF / EPUB checkout */
    ebookUrl: "",
    /** Optional: “Buy on Amazon” label override */
    printLabel: "Buy print on Amazon",
    ebookLabel: "Buy PDF",
  },

  companion: {
    /**
     * Full standalone price product (~$19.99)
     * Gumroad example: https://jack.gumroad.com/l/veil-companion
     */
    fullUrl: "",
    /**
     * Book-buyer discounted product or same product with discount locked in URL
     * Gumroad offer codes: https://.../l/veil-companion?wanted=true&offer_code=PRINT
     * Lemon: discount in checkout link
     */
    printBuyerUrl: "",
    ebookBuyerUrl: "",
    fullLabel: "Get Companion · $19.99",
    buyerLabel: "Get Companion · $5.99",
  },
};

export function hasUrl(url) {
  return typeof url === "string" && url.trim().length > 0;
}

export default commerce;
