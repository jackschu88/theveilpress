import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import TiltCover from "../components/TiltCover";
import { BuyButton } from "../components/BuyButton";
import { MagneticLink } from "../components/MagneticButton";
import MusicPlayer from "../components/MusicPlayer";
import {
  PRESALE,
  EXECUTIVE_VALUE_STACK,
  EXECUTIVE_TOTAL_SOLO,
  EXECUTIVE_PRICE,
  formatPrice,
} from "../commerce";
import { easeOut } from "../motion";

const HeroScene = lazy(() => import("../components/HeroScene"));

const journeyVideos = [
  { id: "main-ad", title: "The Veil of the Square Mile", src: "/videos/journey-main.mp4", poster: "/cover.jpg" },
  { id: "lazy-boy", title: "The news from somewhere else", src: "/videos/journey-lazboy.mp4", poster: "" },
  { id: "crowd", title: "In the crowd", src: "/videos/journey-crowd.mp4", poster: "" },
  { id: "fog-boy", title: "Through the fog", src: "/videos/journey-fogboy.mp4", poster: "" },
];

const soundtrack = [
  { id: "fog-lost", title: "Lost in the Fog", src: "/audio/lost-in-the-fog.mp3" },
  { id: "rollin", title: "Rollin'", src: "/audio/cut-through-the-fog.mp3" },
  { id: "foggy-roads", title: "Foggy Roads", src: "/audio/foggy-roads.mp3" },
  { id: "behind-curtain", title: "Behind the Curtain", src: "/audio/behind-the-curtain.mp3" },
  { id: "worked-bone", title: "Worked to the Bone", src: "/audio/worked-to-the-bone.mp3" },
  { id: "threads-across", title: "Threads Across the Water", src: "/audio/threads-across-the-water.mp3" },
  { id: "now-you-know", title: "Now You Know", src: "/audio/now-you-know.mp3" },
  { id: "same-script", title: "Same Script", src: "/audio/same-script.mp3" },
];

const mediaLibrary = [
  { title: "The Veil — Main Trailer", src: "/videos/square-mile-trailer.mp4", poster: "/cover.jpg" },
  { title: "Companion Guide Trailer", src: "/videos/companion_trailer.mp4", poster: "/companion-cover.jpg" },
  { title: "The Journey — Main Ad", src: "/videos/journey-main.mp4", poster: "/cover.jpg" },
  { title: "The news from somewhere else", src: "/videos/journey-lazboy.mp4", poster: "" },
  { title: "In the crowd", src: "/videos/journey-crowd.mp4", poster: "" },
  { title: "Through the fog", src: "/videos/journey-fogboy.mp4", poster: "" },
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
    desc: "Digital Edition (ebook), audiobook, and Companion PDF — instant delivery on Gumroad at launch.",
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
  const savings = EXECUTIVE_TOTAL_SOLO - EXECUTIVE_PRICE;
  const savingsPct = Math.round((savings / EXECUTIVE_TOTAL_SOLO) * 100);

  const [activeVideo, setActiveVideo] = useState(journeyVideos[0].id);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  const journeyRef = useRef(null);
  const videoRef = useRef(null);

  const currentVideo = journeyVideos.find((v) => v.id === activeVideo);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const tryPlay = async () => {
      try {
        el.muted = true;
        await el.play();
        setNeedsPlay(false);
      } catch {
        setNeedsPlay(true);
      }
    };
    tryPlay();
  }, [activeVideo]);

  function handlePlayOverlay() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    el.play()
      .then(() => setNeedsPlay(false))
      .catch(() => setNeedsPlay(true));
  }

  return (
    <AnimatedPage>
      <section className="hero hero-grid hero-book">
        <Suspense fallback={null}>
          <HeroScene variant="light" />
        </Suspense>
        <motion.div
          className="exec-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          aria-hidden
        />

        <div>
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
            transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
          >
            Limited Founders Edition
          </motion.h1>

          <motion.div
            className="title-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: easeOut }}
          />

          <motion.p
            className="exec-lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: easeOut }}
          >
            The definitive founders package. Signed hardcover book, signed hardcover
            Companion Guide, and every digital format — numbered and extended — at a
            presale price that rewards the conviction.
          </motion.p>

          <motion.div
            className="exec-price-block"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: easeOut }}
          >
            <span className="exec-price">{formatPrice(EXECUTIVE_PRICE)}</span>
            <span className="exec-compare">
              <span className="exec-strikethrough">{formatPrice(EXECUTIVE_TOTAL_SOLO)}</span>
              <span className="exec-save">Save {formatPrice(savings)} ({savingsPct}% off)</span>
            </span>
          </motion.div>

          <motion.div
            className="actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7, ease: easeOut }}
          >
            <BuyButton
              href={PRESALE.executiveFounderPack.url}
              label={`Pre-order Limited Founders · ${formatPrice(EXECUTIVE_PRICE)}`}
              comingSoonLabel="Pre-order link pending"
              className="btn btn-primary btn-shimmer btn-exec"
            />
            <MagneticLink className="btn" to="/presale">
              All presale options
            </MagneticLink>
          </motion.div>
        </div>

        <TiltCover
          src="/cover.jpg"
          alt="The Veil of the Square Mile cover"
        />
      </section>

      <Reveal>
        <hr className="rule rule-pulse" />
      </Reveal>

      {/* ── The Journey ── */}
      <section className="journey-section" ref={journeyRef}>
        <Reveal>
          <h2 className="journey-headline">This isn't just a book. It's a journey.</h2>
          <p className="journey-sub">Watch this before you decide.</p>
        </Reveal>

        <Reveal>
          <div className="journey-player">
            <div className="journey-frame">
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
                <span className="journey-queue-num">{v.id === "main-ad" ? "Featured" : `0${journeyVideos.indexOf(v)}`}</span>
                <span className="journey-queue-title">{v.title}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="journey-footer">Once you see it, you will understand why this matters.</p>
        </Reveal>
      </section>

      {/* ── Hear the Message ── */}
      <section className="section">
        <Reveal>
          <h2 className="exec-section-headline">Songs from the resistance</h2>
          <p className="exec-section-sub">Listen while you decide.</p>
        </Reveal>
        <Reveal>
          <MusicPlayer tracks={soundtrack} />
        </Reveal>
      </section>

      {/* ── What You Receive ── */}
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

      {/* ── The Value ── */}
      <section className="section">
        <Reveal>
          <h2 className="exec-section-headline">The value</h2>
          <p className="exec-section-sub">What each piece costs on its own vs. the pack price.</p>
        </Reveal>
        <Reveal>
          <div className="exec-value-card">
            <div className="exec-value-header">
              <span>Item</span>
              <span>Solo price</span>
            </div>
            {EXECUTIVE_VALUE_STACK.map((v) => (
              <div key={v.item} className="exec-value-row">
                <span>{v.item}</span>
                <span className={v.solo ? "" : "exec-included"}>
                  {v.solo ? formatPrice(v.solo) : "Included"}
                </span>
              </div>
            ))}
            <div className="exec-value-total">
              <span>Total separately</span>
              <span className="exec-strikethrough">{formatPrice(EXECUTIVE_TOTAL_SOLO)}</span>
            </div>
            <div className="exec-value-total exec-value-final">
              <span>Limited Founders Edition</span>
              <span style={{ color: "var(--gold-bright)" }}>{formatPrice(EXECUTIVE_PRICE)}</span>
            </div>
            <div className="exec-value-save">
              <span>You save</span>
              <span>{formatPrice(savings)} ({savingsPct}% off)</span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="actions" style={{ marginTop: "1.5rem" }}>
            <BuyButton
              href={PRESALE.executiveFounderPack.url}
              label={`Pre-order Limited Founders · ${formatPrice(EXECUTIVE_PRICE)}`}
              comingSoonLabel="Pre-order link pending"
              className="btn btn-primary btn-shimmer btn-exec"
            />
          </div>
        </Reveal>
      </section>

      {/* ── Limited edition (no number) ── */}
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
          <Reveal>
            <div className="actions" style={{ justifyContent: "center" }}>
              <BuyButton
                href={PRESALE.executiveFounderPack.url}
                label={`Pre-order Limited Founders · ${formatPrice(EXECUTIVE_PRICE)}`}
                comingSoonLabel="Pre-order link pending"
                className="btn btn-primary btn-shimmer btn-exec btn-exec-lg"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Media Library ── */}
      <section className="section">
        <Reveal>
          <h2 className="exec-section-headline">Explore more</h2>
          <p className="exec-section-sub">All the films in one place.</p>
        </Reveal>
        <Stagger className="exec-media-grid">
          {mediaLibrary.map((m) => (
            <StaggerItem key={m.title}>
              <button
                type="button"
                className="exec-media-card"
                onClick={() => setModalVideo(m)}
              >
                <div className="exec-media-thumb">
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
            <div className="exec-modal-frame">
              <video
                className="exec-modal-video"
                src={modalVideo.src}
                poster={modalVideo.poster || undefined}
                controls
                autoPlay
                playsInline
                preload="auto"
              />
            </div>
            <p className="exec-modal-label">{modalVideo.title}</p>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
