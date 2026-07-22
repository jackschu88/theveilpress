import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import TiltCover from "../components/TiltCover";
import SplitTitle from "../components/SplitTitle";
import { MagneticLink, MagneticAnchor } from "../components/MagneticButton";
import { BuyButton } from "../components/BuyButton";
import commerce, { hasUrl } from "../commerce";
import { easeOut } from "../motion";
import { gsap } from "../scroll";

const HeroScene = lazy(() => import("../components/HeroScene"));

export default function SquareMile() {
  const heroRef = useRef(null);
  const argumentRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useGSAP(
    () => {
      // Matches the reduced-motion pattern used throughout the codebase
      // (GoldDust, FogReveal, SmoothScroll): skip creating the scrub
      // ScrollTrigger so the argument card has no scroll-tied motion
      // under prefers-reduced-motion.
      if (reduce) return;

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
    { scope: argumentRef, dependencies: [reduce] }
  );

  const { printUrl, ebookUrl, printLabel, ebookLabel } = commerce.squareMile;
  const printReady = hasUrl(printUrl);
  const ebookReady = hasUrl(ebookUrl);

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
                  <BuyButton href={printUrl} label={printLabel} />
                )}
                {ebookReady && (
                  <BuyButton
                    href={ebookUrl}
                    label={ebookLabel}
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
          </div>
        </Reveal>
        <Stagger className="price-row">
          <StaggerItem className="price-card price-glow">
            <div className="meta">Print</div>
            <strong>{printReady ? "Order" : "Coming soon"}</strong>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              Trade paperback via Amazon KDP and bookstore channels (IngramSpark).
            </p>
            <BuyButton
              href={printUrl}
              label={printLabel}
              comingSoonLabel="Link pending"
              className="btn btn-primary btn-shimmer"
            />
          </StaggerItem>
          <StaggerItem className="price-card price-glow">
            <div className="meta">PDF / ebook</div>
            <strong>{ebookReady ? "Download" : "Coming soon"}</strong>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              Direct from The Veil Press. Buyers get Companion access at $5.99.
            </p>
            <BuyButton
              href={ebookUrl}
              label={ebookLabel}
              comingSoonLabel="Link pending"
              className="btn btn-primary btn-shimmer"
            />
          </StaggerItem>
        </Stagger>

        {!printReady && !ebookReady && (
          <Reveal delay={0.1}>
            <div className="commerce-placeholder">
              <strong style={{ color: "var(--ink)" }}>How to connect checkout</strong>
              <br />
              1. Create products on Amazon (print) and Gumroad/Lemon (PDF).
              <br />
              2. Paste URLs into{" "}
              <code>src/commerce.js</code> → <code>squareMile.printUrl</code> /{" "}
              <code>ebookUrl</code>.
              <br />
              3. Redeploy. Buttons go live automatically.
            </div>
          </Reveal>
        )}
      </section>

      <section className="section">
        <Stagger className="card-grid two">
          <StaggerItem>
            <Link
              className="card card-lift card-glow"
              to="/books/square-mile/companion"
            >
              <div className="meta">Apparatus</div>
              <h3>Companion Guide</h3>
              <p>
                The map: glossary, timelines, dynastic trees, bibliography,
                steelman. Not a second narrative book.
              </p>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">For print buyers</div>
              <h3>QR path</h3>
              <p>
                Scan the code in the book, or open{" "}
                <code style={{ color: "var(--gold-dim)" }}>
                  theveilpress.com/books/square-mile/companion/print
                </code>{" "}
                for the book-buyer price.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </section>
    </AnimatedPage>
  );
}
