import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { BuyButton } from "../components/BuyButton";
import { trackVideoPlay, trackVideoUnmute, trackCta } from "../lib/analytics";
import { MagneticLink } from "../components/MagneticButton";
import {
  PRESALE,
  EXECUTIVE_VALUE_STACK,
  EXECUTIVE_TOTAL_SOLO,
  EXECUTIVE_PRICE,
  EXECUTIVE_SAVINGS,
  EXECUTIVE_SAVINGS_PCT,
  formatPrice,
} from "../commerce";
import { easeOut } from "../motion";

/**
 * Journey films: aspect must match the file (portrait 9:16 vs landscape 16:9).
 * main-ad is 1920×1080 landscape; lazboy/crowd are 720×1280 portrait.
 */
const journeyVideos = [
  {
    id: "main-ad",
    title: "The Veil of the Square Mile",
    src: "/videos/journey-main.mp4",
    poster: "/cover.jpg",
    aspect: "landscape",
  },
  {
    id: "lazy-boy",
    title: "The news from somewhere else",
    src: "/videos/journey-lazboy.mp4",
    poster: "",
    aspect: "portrait",
  },
  {
    id: "crowd",
    title: "In the crowd",
    src: "/videos/journey-crowd.mp4",
    poster: "",
    aspect: "portrait",
  },
];

/** Explore more — landscape trailers full-width; portrait clips stay phone-frame thumbs. */
const mediaLibrary = [
  {
    title: "The Veil — Main Trailer",
    src: "/videos/square-mile-trailer.mp4",
    poster: "/cover.jpg",
    aspect: "landscape",
  },
  {
    title: "Companion Guide Trailer",
    src: "/videos/companion_trailer.mp4",
    poster: "/companion-cover.jpg",
    aspect: "landscape",
  },
  {
    title: "The Journey — Main Ad",
    src: "/videos/journey-main.mp4",
    poster: "/cover.jpg",
    aspect: "landscape",
  },
  {
    title: "The news from somewhere else",
    src: "/videos/journey-lazboy.mp4",
    poster: "",
    aspect: "portrait",
  },
  {
    title: "In the crowd",
    src: "/videos/journey-crowd.mp4",
    poster: "",
    aspect: "portrait",
  },
  {
    title: "Through the fog",
    src: "/videos/journey-fogboy.mp4",
    poster: "/videos/journey-fogboy-poster.jpg",
    aspect: "landscape",
  },
];

const included = [
  {
    title: "Signed Hardcover Book",
    desc: "First-edition hardcover of The Veil of the Square Mile, personally signed by Jack Schumacher.",
  },
  {
    title: "Signed Hardcover Companion Guide",
    desc: "The full apparatus in hardcover — glossary, timelines, dynastic trees, bibliography, steelman — also signed.",
  },
  {
    title: "All Digital Assets",
    desc: "Digital Edition (ebook), audiobook, and Companion PDF — Gumroad pre-order; delivery at launch / campaign timeline.",
  },
  {
    title: "Personal Message",
    desc: "A short handwritten message from the author, included with your order.",
  },
  {
    title: "Companion Extension",
    desc: "Exclusive bonus chapter — not available in the standard Companion edition.",
  },
  {
    title: "Numbered Edition",
    desc: "One of a limited run. Your copy is individually numbered. No reprints.",
  },
];

export default function ExecutiveFounder() {
  const savings = EXECUTIVE_SAVINGS;
  const savingsPct = EXECUTIVE_SAVINGS_PCT;

  const [activeVideo, setActiveVideo] = useState(journeyVideos[0].id);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);

  const currentVideo = journeyVideos.find((v) => v.id === activeVideo);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // Force the browser to pick up the new src when the queue changes.
    el.load();
    const tryPlay = async () => {
      try {
        el.muted = true;
        await el.play();
        setNeedsPlay(false);
        const vid = journeyVideos.find((v) => v.id === activeVideo);
        trackVideoPlay(activeVideo, {
          title: vid?.title || activeVideo,
          source: "founders_journey",
          muted: "true",
        });
      } catch {
        setNeedsPlay(true);
      }
    };
    const onError = () => setNeedsPlay(true);
    el.addEventListener("error", onError);
    tryPlay();
    return () => el.removeEventListener("error", onError);
  }, [activeVideo]);

  function handlePlayOverlay() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    trackVideoUnmute(activeVideo, { source: "founders_journey" });
    el.play()
      .then(() => setNeedsPlay(false))
      .catch(() => setNeedsPlay(true));
  }

  // Modal autoplay is outside the original click gesture — mute first so it starts.
  useEffect(() => {
    if (!modalVideo) return undefined;
    const el = modalVideoRef.current;
    if (!el) return undefined;
    el.muted = true;
    el.play().catch(() => {});
    return undefined;
  }, [modalVideo]);

  function scrollToMedia() {
    mediaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AnimatedPage>
      {/* ── Hero: introduce + scroll to media (no purchase yet) ── */}
      <section className="exec-hero-composite" aria-label="Limited Founders Edition">
        <div className="exec-hero-stage">
          <img
            className="exec-hero-photo"
            src="/limited-founders-hero-wide.jpg"
            alt="The Veil of the Square Mile hardcover on marble pedestal"
          />
          <div className="exec-hero-shade" aria-hidden />

          <motion.div
            className="exec-hero-glass"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: easeOut }}
          >
            <motion.span
              className="exec-badge"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              Limited Edition
            </motion.span>

            <motion.h1
              className="exec-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            >
              Limited Founders Edition
            </motion.h1>

            <motion.div
              className="title-rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: easeOut }}
            />

            <motion.p
              className="exec-lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: easeOut }}
            >
              The definitive founders package. Signed hardcover book, signed hardcover
              Companion Guide, and every digital format — numbered and extended — at a
              presale price that rewards the conviction.
            </motion.p>

            <motion.div
              className="exec-price-block"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: easeOut }}
            >
              <span className="exec-price">{formatPrice(EXECUTIVE_PRICE)}</span>
              <span className="exec-shipping">Free shipping</span>
              <span className="exec-compare">
                <span className="exec-strikethrough">{formatPrice(EXECUTIVE_TOTAL_SOLO)}</span>
                <span className="exec-save">
                  Save {formatPrice(savings)} ({savingsPct}% off)
                </span>
              </span>
            </motion.div>

            <motion.div
              className="actions"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: easeOut }}
            >
              <button
                type="button"
                className="btn btn-primary btn-shimmer btn-exec"
                onClick={() => {
                  trackCta("why_limited_founders", { source: "founders_hero" });
                  scrollToMedia();
                }}
              >
                Why Limited Founders Edition
              </button>
              <MagneticLink className="btn" to="/library/founders">
                All presale options
              </MagneticLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── ALL MEDIA (before purchase) ── */}
      <div id="why-limited-founders" ref={mediaRef} className="exec-media-anchor">
        <Reveal>
          <hr className="rule rule-pulse" />
        </Reveal>

        {/* Journey films */}
        <section className="journey-section">
          <Reveal>
            <h2 className="journey-headline">This isn't just a book. It's a journey.</h2>
            <p className="journey-sub">Watch this before you decide.</p>
          </Reveal>

          <Reveal>
            <div className="journey-player">
              <div
                className={`journey-frame${
                  currentVideo?.aspect === "landscape" ? " journey-frame-landscape" : ""
                }`}
              >
                <video
                  ref={videoRef}
                  className="journey-video"
                  src={currentVideo?.src}
                  poster={currentVideo?.poster || undefined}
                  loop
                  playsInline
                  preload="metadata"
                  controls
                  aria-label={currentVideo?.title}
                />
                {needsPlay && (
                  <button
                    type="button"
                    className="trailer-play-sound"
                    onClick={handlePlayOverlay}
                  >
                    Watch with sound
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="journey-queue">
              {journeyVideos.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`journey-queue-item${activeVideo === v.id ? " journey-queue-active" : ""}`}
                  onClick={() => setActiveVideo(v.id)}
                >
                  <span className="journey-queue-num">
                    {v.id === "main-ad" ? "Featured" : `0${journeyVideos.indexOf(v)}`}
                  </span>
                  <span className="journey-queue-title">{v.title}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <p className="journey-footer">Once you see it, you will understand why this matters.</p>
          </Reveal>
        </section>

        {/* Film library */}
        <section className="section">
          <Reveal>
            <h2 className="exec-section-headline">Explore more</h2>
            <p className="exec-section-sub">All the films in one place.</p>
          </Reveal>
          <Stagger className="exec-media-grid">
            {mediaLibrary.map((m) => (
              <StaggerItem
                key={m.title}
                className={m.aspect === "landscape" ? "exec-media-item-landscape" : undefined}
              >
                <button
                  type="button"
                  className="exec-media-card"
                  onClick={() => {
                    setModalVideo(m);
                    trackVideoPlay(m.title, { source: "founders_media_library" });
                  }}
                >
                  <div
                    className={`exec-media-thumb${
                      m.aspect === "landscape" ? " exec-media-thumb-landscape" : ""
                    }`}
                  >
                    {m.poster ? (
                      <img src={m.poster} alt={m.title} />
                    ) : (
                      <div className="exec-media-placeholder">
                        <span>▶</span>
                      </div>
                    )}
                    <div className="exec-media-play" aria-hidden>
                      <span>▶</span>
                    </div>
                  </div>
                  <p className="exec-media-label">{m.title}</p>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      </div>

      {/* ── Package details ── */}
      <section className="section">
        <Reveal>
          <h2 className="exec-section-headline">What you receive</h2>
        </Reveal>
        <Stagger className="exec-included-grid">
          {included.map((item) => (
            <StaggerItem key={item.title} className="exec-included-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section exec-value-section">
        <Reveal>
          <h2 className="exec-section-headline">The value</h2>
          <p className="exec-section-sub">
            What each piece costs on its own (product + shipping where it applies)
            vs. the Limited Founders pack price.
          </p>
        </Reveal>
        <Reveal>
          <div className="exec-value-card">
            <div className="exec-value-header">
              <span>Item</span>
              <span>Solo price</span>
            </div>
            {EXECUTIVE_VALUE_STACK.map((v) => (
              <div key={v.item} className="exec-value-row">
                <span>
                  {v.item}
                  {v.detail ? (
                    <span
                      className="muted"
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 400,
                        marginTop: "0.15rem",
                      }}
                    >
                      {v.detail}
                    </span>
                  ) : null}
                </span>
                <span className={v.solo != null ? "" : "exec-included"}>
                  {v.solo != null ? formatPrice(v.solo) : "Included"}
                </span>
              </div>
            ))}
            <div className="exec-value-total">
              <span>Total if purchased separately</span>
              <span className="exec-strikethrough">{formatPrice(EXECUTIVE_TOTAL_SOLO)}</span>
            </div>
            <div className="exec-value-total exec-value-final">
              <span>Limited Founders Edition · Free shipping</span>
              <span style={{ color: "var(--gold-bright)" }}>{formatPrice(EXECUTIVE_PRICE)}</span>
            </div>
            <div className="exec-value-save">
              <span>You save</span>
              <span>
                {formatPrice(savings)} ({savingsPct}% off)
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section">
        <div className="exec-limited-section">
          <Reveal>
            <div className="exec-limited-badge">Limited numbered edition</div>
            <h2 className="exec-limited-title">One print run. Numbered. Never reprinted.</h2>
            <p className="exec-limited-desc">
              The Limited Founders Edition is a single limited run. Each set is
              individually numbered; both hardcovers are signed. When they are gone,
              this edition closes permanently.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Purchase (bottom only) ── */}
      <section className="section exec-purchase" id="purchase">
        <Reveal>
          <div className="exec-purchase-card">
            <p className="exec-purchase-eyebrow">Presale through August 26, 2026</p>
            <h2 className="exec-purchase-title">Pre-order your Limited Founders Edition</h2>
            <p className="exec-purchase-price">
              <span className="exec-price">{formatPrice(EXECUTIVE_PRICE)}</span>
              <span className="exec-shipping">Free shipping</span>
              <span className="exec-compare">
                <span className="exec-strikethrough">{formatPrice(EXECUTIVE_TOTAL_SOLO)}</span>
                <span className="exec-save">
                  Save {formatPrice(savings)} ({savingsPct}% off)
                </span>
              </span>
            </p>
            <div className="actions" style={{ justifyContent: "center" }}>
              <BuyButton
                href={PRESALE.executiveFounderPack.url}
                label={`Pre-order Limited Founders · ${formatPrice(EXECUTIVE_PRICE)}`}
                comingSoonLabel="Pre-order link pending"
                className="btn btn-primary btn-shimmer btn-exec btn-exec-lg"
                product={PRESALE.executiveFounderPack}
              />
              <MagneticLink className="btn" to="/library/founders">
                All presale options
              </MagneticLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Video modal */}
      {modalVideo && (
        <div className="exec-modal-overlay" onClick={() => setModalVideo(null)}>
          <div className="exec-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="exec-modal-close"
              onClick={() => setModalVideo(null)}
            >
              Close
            </button>
            <div
              className={`exec-modal-frame${
                modalVideo.aspect === "landscape" ? " exec-modal-frame-landscape" : ""
              }`}
            >
              <video
                ref={modalVideoRef}
                className="exec-modal-video"
                src={modalVideo.src}
                poster={modalVideo.poster || undefined}
                controls
                autoPlay
                playsInline
                muted
                preload="auto"
                style={
                  modalVideo.aspect === "portrait"
                    ? { aspectRatio: "9 / 16", maxHeight: "78vh", margin: "0 auto" }
                    : undefined
                }
              />
            </div>
            <p className="exec-modal-label">{modalVideo.title}</p>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
