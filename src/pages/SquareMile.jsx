import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import TiltCover from "../components/TiltCover";
import SplitTitle from "../components/SplitTitle";
import { MagneticLink, MagneticAnchor } from "../components/MagneticButton";
import { BuyButton } from "../components/BuyButton";
import commerce, {
  products,
  hasUrl,
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

export default function SquareMile() {
  const heroRef = useRef(null);
  const argumentRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

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

  const printReady = hasUrl(products.print.url);
  const ebookReady = hasUrl(products.ebook.url);

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

          <motion.div
            className="actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7, ease: easeOut }}
          >
            {printReady || ebookReady ? (
              <>
                {printReady && (
                  <BuyButton
                    href={products.print.url}
                    label={products.print.label}
                  />
                )}
                {ebookReady && (
                  <BuyButton
                    href={products.ebook.url}
                    label={products.ebook.label}
                    className="btn btn-shimmer"
                  />
                )}
              </>
            ) : (
              <MagneticAnchor
                className="btn btn-primary btn-shimmer"
                href="#buy"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("buy")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get the book
              </MagneticAnchor>
            )}
            <MagneticLink className="btn" to="/books/square-mile/companion">
              Companion Guide
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
              Checkout is on Gumroad — secure, instant for digital, print ships
              to you. Companion is {formatPrice(products.companion.price)}{" "}
              standalone, or {formatPrice(commerce.companion.addOnPrice)} inside
              any bundle. Best value: Full Bundle at{" "}
              {formatPrice(products.bundleFull.price)}.
            </p>
          </div>
        </Reveal>

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
            Bundles · best value
          </p>
        </Reveal>
        <Stagger className="price-row">
          {bundles.map((p) => (
            <StaggerItem
              key={p.name}
              className={`price-card price-glow${
                p === products.bundleFull ? " price-card-featured" : ""
              }`}
            >
              <div className="meta">
                {p === products.bundleFull ? "Recommended" : "Bundle"}
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

      </section>

      <section className="section">
        <Stagger className="card-grid two">
          <StaggerItem>
            <Link
              className="card card-lift card-glow"
              to="/books/square-mile/companion"
            >
              <div className="meta">
                Apparatus · {formatPrice(commerce.companion.fullPrice)}
              </div>
              <h3>Companion Guide</h3>
              <p>
                The map: glossary, timelines, dynastic trees, bibliography,
                steelman. {formatPrice(commerce.companion.fullPrice)} alone, or{" "}
                {formatPrice(commerce.companion.addOnPrice)} when added in a
                bundle.
              </p>
            </Link>
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
