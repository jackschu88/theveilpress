import { lazy, Suspense, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import TiltCover from "../components/TiltCover";
import SplitTitle from "../components/SplitTitle";
import { MagneticLink } from "../components/MagneticButton";
import { BuyButton, ProductBuyButton } from "../components/BuyButton";
import {
  products,
  formatPrice,
  PRESALE_ENDS_LABEL,
  COMING_LABEL,
} from "../commerce";
import { easeOut } from "../motion";

const HeroScene = lazy(() => import("../components/HeroScene"));

const PRESALE = [
  products.softcover,
  products.hardcover,
  products.foundersEdition,
  products.limitedFounders,
];

const COMING = [
  products.ebook,
  products.audiobook,
  products.companion,
  products.bundleEbookAudioCompanion,
];

function scrollToBuy() {
  document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" });
}

export default function SquareMile() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#buy") {
      return undefined;
    }
    const t = window.setTimeout(scrollToBuy, 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatedPage>
      {/* ── Hero ── */}
      <section className="hero hero-grid hero-book" ref={heroRef}>
        <Suspense fallback={null}>
          <HeroScene variant="light" />
        </Suspense>
        <motion.div className="book-hero-glow" style={{ y: bgY }} aria-hidden />

        <div className="veil-hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            Volume I · The Veil Press
          </motion.p>

          <SplitTitle text="The Veil of the Square Mile" className="h1-book" />

          <motion.div
            className="title-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.75, ease: easeOut }}
          />

          <motion.p
            className="lede lede-glow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: easeOut }}
          >
            The invisible British financial empire — documented, not dramatized.
          </motion.p>

          <motion.p
            className="muted author-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.5 }}
          >
            Jack Schumacher · Presale through {PRESALE_ENDS_LABEL}
          </motion.p>

          <motion.div
            className="actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6, ease: easeOut }}
          >
            <MagneticLink
              className="btn btn-primary btn-shimmer"
              to="/library/veil#buy"
              onClick={(e) => {
                e.preventDefault();
                scrollToBuy();
              }}
            >
              Pre-order formats
            </MagneticLink>
            <MagneticLink className="btn btn-shimmer" to="/library/founders">
              Founders editions
            </MagneticLink>
            <MagneticLink className="btn btn-shimmer" to="/library/map">
              Companion Guide
            </MagneticLink>
          </motion.div>
        </div>

        <TiltCover
          src="/cover.jpg"
          alt="Cover of The Veil of the Square Mile"
        />
      </section>

      <Reveal>
        <hr className="rule rule-pulse" />
      </Reveal>

      {/* ── Argument ── */}
      <section className="section veil-section">
        <Reveal>
          <div className="card card-glow argument-card">
            <div className="meta">The argument</div>
            <p className="argument-lead">
              For centuries, the City of London Corporation has been among the
              most durable institutional settings in which the large decisions of
              the modern world have been prepared, financed, and locked in.
            </p>
            <p className="muted" style={{ marginBottom: 0, fontSize: "1.1rem" }}>
              Fifteen parts — foundations to the digital veil. Not cabals: a
              corporate order and a premise about what a human being is.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Trailer ── */}
      <section className="section veil-section">
        <Reveal>
          <div className="section-head">
            <h2>Trailer</h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="product-trailer">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/cover.jpg"
            >
              <source src="/videos/square-mile-trailer.mp4" type="video/mp4" />
              <source src="/trailer.mp4" type="video/mp4" />
            </video>
          </div>
        </Reveal>
      </section>

      {/* ── Buy ── */}
      <section className="section veil-section" id="buy">
        <Reveal>
          <div className="section-head veil-buy-head">
            <div>
              <p className="meta" style={{ margin: "0 0 0.4rem", color: "var(--gold)" }}>
                Presale through {PRESALE_ENDS_LABEL}
              </p>
              <h2>Pre-order</h2>
              <p className="muted" style={{ margin: "0.5rem 0 0", maxWidth: "36rem" }}>
                Softcover, hardcover, and both Founders editions are live now.
                Digital formats and the Companion Guide: {COMING_LABEL}.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="meta" style={{ margin: "0 0 0.85rem" }}>
            On sale now
          </p>
        </Reveal>
        <Stagger className="price-row">
          {PRESALE.map((p) => (
            <StaggerItem
              key={p.name}
              className={`price-card price-glow${
                p === products.limitedFounders ? " price-card-featured" : ""
              }`}
            >
              <div className="meta">
                {p === products.limitedFounders ? "Complete set" : "Presale"}
              </div>
              <strong>{formatPrice(p.price)}</strong>
              <p className="price-card-name">{p.name}</p>
              {p.shippingNote ? (
                <p className="muted" style={{ margin: "0.15rem 0 0", fontSize: "0.85rem" }}>
                  {p.shippingNote}
                </p>
              ) : null}
              <p className="muted" style={{ margin: "0.5rem 0 1rem" }}>
                {p.blurb}
              </p>
              {p.url ? (
                <BuyButton
                  href={p.url}
                  label={p.label}
                  className="btn btn-primary btn-shimmer"
                />
              ) : (
                <ProductBuyButton
                  product={p}
                  className="btn btn-primary btn-shimmer"
                />
              )}
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <p className="meta" style={{ margin: "2rem 0 0.85rem" }}>
            {COMING_LABEL}
          </p>
        </Reveal>
        <Stagger className="price-row">
          {COMING.map((p) => (
            <StaggerItem key={p.name} className="price-card price-glow">
              <div className="meta">{COMING_LABEL}</div>
              <strong>{formatPrice(p.price)}</strong>
              <p className="price-card-name">{p.name}</p>
              {p.shippingNote ? (
                <p className="muted" style={{ margin: "0.15rem 0 0", fontSize: "0.85rem" }}>
                  {p.shippingNote}
                </p>
              ) : null}
              <p className="muted" style={{ margin: "0.5rem 0 1rem" }}>
                {p.blurb}
              </p>
              {p === products.companion ? (
                <MagneticLink className="btn btn-shimmer" to="/library/map">
                  Watch the Companion trailer
                </MagneticLink>
              ) : (
                <ProductBuyButton product={p} />
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ── Next ── */}
      <section className="section veil-section">
        <Stagger className="card-grid two">
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">Companion · {COMING_LABEL}</div>
              <h3>The Map</h3>
              <p>
                Glossary, timelines, dynastic trees, bibliography, steelman —
                the apparatus for Volume I. Standalone {COMING_LABEL}; included
                (signed) in Limited Founders.
              </p>
              <div className="actions" style={{ marginTop: "1rem" }}>
                <MagneticLink
                  className="btn btn-primary btn-shimmer"
                  to="/library/map"
                >
                  Open Companion
                </MagneticLink>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">Founders</div>
              <h3>Signed &amp; limited</h3>
              <p>
                Founders Edition (signed hardcover) and Limited Founders (signed
                book + signed Companion + all digital, free shipping).
              </p>
              <div className="actions" style={{ marginTop: "1rem" }}>
                <MagneticLink
                  className="btn btn-primary btn-shimmer"
                  to="/library/founders"
                >
                  Founders page
                </MagneticLink>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </section>
    </AnimatedPage>
  );
}
