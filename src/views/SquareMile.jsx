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
  PUBLIC_GRID,
  LIVE_BANNER,
} from "../commerce";
import { easeOut } from "../motion";
import { trackVideoPlay } from "../lib/analytics";

const HeroScene = lazy(() => import("../components/HeroScene"));

const LIVE = PUBLIC_GRID;

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
            A serious examination of how durable power actually works — and why the
            structure outlasts the story.
          </motion.p>

          <motion.p
            className="muted author-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.5 }}
          >
            Jack Schumacher · Ships now
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
              Buy formats
            </MagneticLink>
            <MagneticLink className="btn btn-shimmer" to="/library/veil#buy">
              Signed hardcover
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
              Most Americans can feel that the systems shaping their lives do not fully
              match the story they are told about how power works. Elections change
              faces. Narratives shift. Beneath that surface, certain structures of
              financial and institutional power persist with remarkable continuity.
              They influence markets, capital flows, debt conditions, and the
              boundaries of what is treated as possible. Most people experience the
              effects without being shown the architecture.
            </p>
            <p className="muted" style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
              <em>The Veil of the Square Mile</em> examines one of the most durable of
              those structures — the City of London Corporation — not as a distant
              British peculiarity, but as a continuous institutional form that has
              maintained financial centrality and operational continuity across
              centuries, with consequences that reach well beyond the United Kingdom.
            </p>
            <p className="muted" style={{ marginBottom: 0, fontSize: "1.1rem" }}>
              This is not a book about British politics. It is a documented study of how
              durable power actually operates: through architecture, money,
              jurisdiction, narrative, and access. Volume I follows the record.
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
              onPlay={() => trackVideoPlay("square-mile-trailer", { source: "book_page" })}
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
                Available now
              </p>
              <h2>Buy</h2>
              <p className="muted" style={{ margin: "0.5rem 0 0", maxWidth: "36rem" }}>
                {LIVE_BANNER}
              </p>
            </div>
          </div>
        </Reveal>

        <Stagger className="price-row">
          {LIVE.map((p) => (
            <StaggerItem
              key={p.name}
              className={`price-card price-glow${
                p === products.signedHardcover ? " price-card-featured" : ""
              }`}
            >
              <div className="meta">{p.badge || "Available now"}</div>
              <strong>{formatPrice(p.price)}</strong>
              <p className="price-card-name">{p.name}</p>
              {p.shippingNote ? (
                <p className="muted" style={{ margin: "0.15rem 0 0", fontSize: "0.85rem" }}>
                  {p.shippingNote}
                </p>
              ) : null}
              <p className="muted" style={{ margin: "0.5rem 0 0.35rem" }}>
                {p.blurb}
              </p>
              {p.deliveryNote ? (
                <p className="muted" style={{ margin: "0 0 1rem", fontSize: "0.85rem" }}>
                  {p.deliveryNote}
                </p>
              ) : (
                <p className="muted" style={{ margin: "0 0 1rem" }} />
              )}
              {p.url ? (
                <BuyButton
                  href={p.url}
                  label={p.label}
                  className="btn btn-primary btn-shimmer"
                  product={p}
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
      </section>

      {/* ── Next ── */}
      <section className="section veil-section">
        <Stagger className="card-grid two">
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">Companion · Ships in about a week</div>
              <h3>The Map</h3>
              <p>
                The book is the journey. The Companion Guide is the map — primary
                sources, timelines, institutional lineages, and supporting material
                that make the argument legible. Hardcover follows in about one week.
                The PDF is in the digital bundles, instant after purchase.
              </p>
              <div className="actions" style={{ marginTop: "1rem" }}>
                <MagneticLink
                  className="btn btn-primary btn-shimmer"
                  to="/library/map"
                >
                  Companion Guide
                </MagneticLink>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">Short run</div>
              <h3>Signed hardcover</h3>
              <p>
                The Founders seed run is closed. Signed hardcovers of the book are
                available while the current short run of 25 lasts. Signed before
                ship.
              </p>
              <div className="actions" style={{ marginTop: "1rem" }}>
                <BuyButton
                  href={products.signedHardcover.url}
                  label={products.signedHardcover.label}
                  className="btn btn-primary btn-shimmer"
                  product={products.signedHardcover}
                />
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </section>
    </AnimatedPage>
  );
}
