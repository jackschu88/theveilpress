/**
 * The Veil Press — analytics helpers
 * ---------------------------------
 * Thin wrappers around @vercel/analytics `track()`.
 * Safe to call from React islands and plain handlers.
 * Fails silently if analytics is unavailable (SSR / blocked).
 *
 * View events in: Vercel → theveilpress → Analytics → Events
 * (Custom events require Web Analytics enabled; Events UI is on Pro.)
 */

import { track } from "@vercel/analytics";

function safeTrack(name, props) {
  if (typeof window === "undefined") return;
  try {
    if (props && Object.keys(props).length > 0) {
      track(name, props);
    } else {
      track(name);
    }
  } catch {
    // Never break UI for analytics
  }
}

/** Normalize a product-ish object or string into event props. */
function productProps(productOrName, extra = {}) {
  if (!productOrName) return { ...extra };
  if (typeof productOrName === "string") {
    return { product: productOrName, ...extra };
  }
  const name = productOrName.name || productOrName.label || "unknown";
  const props = { product: name, ...extra };
  if (typeof productOrName.price === "number") {
    props.price = String(productOrName.price);
  }
  if (productOrName.saleStatus) {
    props.sale_status = productOrName.saleStatus;
  }
  return props;
}

/** Gumroad / external checkout click */
export function trackProductClick(productOrName, extra = {}) {
  safeTrack("product_click", productProps(productOrName, extra));
}

/** Internal CTA (Founders page, Companion, Brief, etc.) */
export function trackCta(name, extra = {}) {
  safeTrack("cta_click", { cta: name, ...extra });
}

/** Video started / resumed with intent */
export function trackVideoPlay(videoId, extra = {}) {
  safeTrack("video_play", { video: videoId, ...extra });
}

/** User unmuted or chose play-with-sound */
export function trackVideoUnmute(videoId, extra = {}) {
  safeTrack("video_unmute", { video: videoId, ...extra });
}

/** Music track play (new track or resume after pause counts as play) */
export function trackMusicPlay(track, extra = {}) {
  const id = track?.id || "unknown";
  const title = track?.title || id;
  safeTrack("music_play", { track_id: id, track: title, ...extra });
}

/** Optional: music pause */
export function trackMusicPause(track, extra = {}) {
  const id = track?.id || "unknown";
  const title = track?.title || id;
  safeTrack("music_pause", { track_id: id, track: title, ...extra });
}

/** Download / “add to playlist” on a track */
export function trackMusicDownload(track, extra = {}) {
  const id = track?.id || "unknown";
  const title = track?.title || id;
  safeTrack("music_download", { track_id: id, track: title, ...extra });
}

/** Brief / newsletter interest */
export function trackBriefInterest(extra = {}) {
  safeTrack("brief_interest", extra);
}

/** Generic escape hatch */
export function trackEvent(name, props = {}) {
  safeTrack(name, props);
}

export default {
  trackProductClick,
  trackCta,
  trackVideoPlay,
  trackVideoUnmute,
  trackMusicPlay,
  trackMusicPause,
  trackMusicDownload,
  trackBriefInterest,
  trackEvent,
};
