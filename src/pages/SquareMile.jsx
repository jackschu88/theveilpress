import { lazy, Suspense, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import TiltCover from "../components/TiltCover";
import SplitTitle from "../components/SplitTitle";
import { MagneticLink, MagneticAnchor } from "../components/MagneticButton";
import { BuyButton } from "../components/BuyButton";
import commerce, {
  products,
  formatPrice,
} from "../commerce";
import { easeOut } from "../motion";
import { gsap } from "../scroll";
import { useScrollReveal } from "../hooks/useScrollReveal";

const HeroScene = lazy(() => import("../components/HeroScene"));

const individuals = [
  products.print,
  products.ebook,
  products.audiobook,
  products.companion,
];

const bundles = [
  products.bundleEbookAudio,
  products.bundlePrintCompanion,
  products.bundleEbookCompanion,
  products.bundleAudioCompanion,
  products.bundleEbookAudioCompanion,
  products.bundleFull,
];

function scrollToBuy() {
  document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" });
}

export default function SquareMile() {
  const heroRef = useRef(null);
  const argumentRef = useRef(null);
  const location = useLocation();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Home / Companion deep-links use #buy — scroll after route paint.
  useEffect(() => {
    if (location.hash !== "#buy") return undefined;
    const t = window.setTimeout(() => {
      scrollToBuy();
    }, 120);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  useScrollReveal(
    () => {
      if (!argumentRef.current) return;
      gsap.fromTo(
        argumentRef.current,
        { opacity: 0, scale: 0.94, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: argumentRef.current,
            start: "top 88%",
            end: "top 55%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: argumentRef }
  );

  return (
    <AnimatedPage>
      <section className="hero hero-grid hero-book" ref={heroRef}>
        <Suspense fallback={null}>
          <HeroScene variant="light" />
        </Suspense>
        <motion.div className="book-hero-glow" style={{ y: bgY }} aria-hidden />
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: easeOut }}
          >
            Volume I · The Veil Press
          </motion.p>

          <SplitTitle text="The Veil of the Square Mile" className="h1-book" />

          <motion.div
            className="title-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.85, ease: easeOut }}
          />

          <motion.p
            className="lede lede-glow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: easeOut }}
          >
            The invisible British financial empire — documented, not dramatized.
          </motion.p>

          <motion.p
            className="muted author-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Jack Schumacher
          </motion.p>

          {/* Stay on-site first: formats + bundles, then Companion explainer */}
          <motion.div
            className="actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7, ease: easeOut }}
          >
            <MagneticAnchor
              className="btn btn-primary btn-shimmer"
              href="#buy"
              onClick={(e) => {
                e.preventDefault();
                scrollToBuy();
              }}
            >
              Formats &amp; bundles
            </MagneticAnchor>
            <MagneticLink
              className="btn btn-shimmer"
              to="/books/square-mile/companion"
            >
              Companion · why buy it
            </MagneticLink>
          </motion.div>
        </div>

        <TiltCover
          src="/cover.jpg"
          alt="Cover of The Veil of the Square Mile — hand drawing a curtain on the City of London skyline"
        />
      </section>

      <Reveal>
        <hr className="rule rule-pulse" />
      </Reveal>

      <div ref={argumentRef} className="section">
        <div className="card card-glow argument-card">
          <div className="meta">The argument</div>
          <p className="argument-lead">
            For centuries, the City of London Corporation has been among the most
            durable institutional settings in which the large decisions of the
            modern world have been prepared, financed, and locked in.
          </p>
          <p className="muted" style={{ marginBottom: 0, fontSize: "1.12rem" }}>
            Fifteen parts. Foundations to the digital veil. Not cabals — a
            corporate order and a premise about what a human being is.
          </p>
        </div>
      </div>

      <section className="section" id="buy">
        <Reveal>
          <div className="section-head">
            <h2>Get the book</h2>
            <p className="muted" style={{ margin: "0.5rem 0 0", maxWidth: "36rem" }}>
              Pick a format or save with a bundle. Checkout is on Gumroad —
              secure, instant for digital, print ships to you. Bundles: main
              product full price, add-ons 20% off — Full Bundle add-ons 25% off
              at {formatPrice(products.bundleFull.price)}.
            </p>
          </div>
        </Reveal>

        {/* Pitch Companion before single-SKU impulse checkout */}
        <Reveal>
          <div className="card card-glow companion-buy-teaser">
            <MagneticLink
              to="/books/square-mile/companion"
              className="companion-buy-teaser-cover"
            >
              <img src="/companion-cover.jpg" alt="Companion Guide cover" />
            </MagneticLink>
            <div>
              <div className="meta" style={{ marginBottom: "0.35rem" }}>
                Before you buy · Companion Guide
              </div>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.2rem" }}>
                Watch why the map matters
              </h3>
              <p className="muted" style={{ margin: "0 0 1rem" }}>
                Short trailer + what&apos;s inside. Companion Guide{" "}
                {formatPrice(products.companion.price)}.
              </p>
              <div className="actions">
                <MagneticLink
                  className="btn btn-primary btn-shimmer"
                  to="/books/square-mile/companion"
                >
                  Watch the Companion video
                </MagneticLink>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="meta" style={{ margin: "1.75rem 0 0.75rem" }}>
            Bundles · best value
          </p>
        </Reveal>
        <Stagger className="price-row">
          {bundles.map((p) => (
            <StaggerItem
              key={p.name}
              className={`price-card price-glow${
                p === products.bundleFull ||
                p === products.bundleEbookAudioCompanion
                  ? " price-card-featured"
                  : ""
              }`}
            >
              <div className="meta">
                {p === products.bundleFull
                  ? "Recommended"
                  : p === products.bundleEbookAudioCompanion
                    ? "Best digital"
                    : "Bundle"}
              </div>
              <strong>{formatPrice(p.price)}</strong>
              <p
                style={{
                  margin: "0 0 0.35rem",
                  color: "var(--ink)",
                  fontFamily: "Cinzel, serif",
                  fontSize: "1.05rem",
                }}
              >
                {p.name}
              </p>
              <p className="muted" style={{ margin: "0 0 1rem" }}>
                {p.blurb}
              </p>
              <BuyButton
                href={p.url}
                label={p.label}
                comingSoonLabel="Checkout pending"
                className="btn btn-primary btn-shimmer"
              />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <p className="meta" style={{ margin: "1.75rem 0 0.75rem" }}>
            Individual
          </p>
        </Reveal>
        <Stagger className="price-row">
          {individuals.map((p) => (
            <StaggerItem key={p.name} className="price-card price-glow">
              <div className="meta">{p.name}</div>
              <strong>{formatPrice(p.price)}</strong>
              <p className="muted" style={{ margin: "0 0 1rem" }}>
                {p.blurb}
              </p>
              {p === products.companion ? (
                <div className="actions" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.5rem" }}>
                  <MagneticLink
                    className="btn btn-shimmer"
                    to="/books/square-mile/companion"
                  >
                    Watch why · then buy
                  </MagneticLink>
                  <BuyButton
                    href={p.url}
                    label={p.label}
                    comingSoonLabel="Checkout pending"
                    className="btn btn-primary btn-shimmer"
                  />
                </div>
              ) : (
                <BuyButton
                  href={p.url}
                  label={p.label}
                  comingSoonLabel="Checkout pending"
                  className="btn btn-primary btn-shimmer"
                />
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section">
        <Stagger className="card-grid two">
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">
                Apparatus · {formatPrice(commerce.companion.fullPrice)}
              </div>
              <h3>Companion Guide</h3>
              <p>
                The map: glossary, timelines, dynastic trees, bibliography,
                steelman. {formatPrice(commerce.companion.fullPrice)}.
              </p>
              <div className="actions" style={{ marginTop: "1rem" }}>
                <MagneticLink
                  className="btn btn-primary btn-shimmer"
                  to="/books/square-mile/companion"
                >
                  Watch why · trailer
                </MagneticLink>
                <BuyButton
                  href={products.companion.url}
                  label={products.companion.label}
                />
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">Full Bundle</div>
              <h3>{formatPrice(products.bundleFull.price)}</h3>
              <p>
                Print + Digital Edition + audiobook + Companion Guide. One checkout on
                Gumroad — everything for readers who want the complete set.
              </p>
              <div style={{ marginTop: "1rem" }}>
                <BuyButton
                  href={products.bundleFull.url}
                  label={products.bundleFull.label}
                  comingSoonLabel="Checkout pending"
                />
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </section>
    </AnimatedPage>
  );
}
