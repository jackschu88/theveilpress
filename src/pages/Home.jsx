import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import SplitTitle from "../components/SplitTitle";
import { MagneticLink } from "../components/MagneticButton";
import { easeOut } from "../motion";
import { gsap, ScrollTrigger } from "../scroll";
import { useScrollReveal } from "../hooks/useScrollReveal";

const HeroScene = lazy(() => import("../components/HeroScene"));

export default function Home() {
  const heroRef = useRef(null);
  const orbRef = useRef(null);
  const featuredRef = useRef(null);
  const featuredImgRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);

  // Prefer sound on; browsers may block unmuted autoplay until a gesture.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.play().catch(() => {
      // Autoplay with sound blocked — leave unmuted so play starts with audio.
    });
  }, []);

  useScrollReveal(
    () => {
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          yPercent: 40,
          opacity: 0.15,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (featuredRef.current && featuredImgRef.current) {
        gsap.fromTo(
          featuredImgRef.current,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          }
        );

        ScrollTrigger.create({
          trigger: featuredRef.current,
          start: "top top",
          end: "+=260",
          pin: true,
          pinSpacing: true,
        });
      }
    },
    { scope: heroRef }
  );

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted) {
      el.play().catch(() => {});
    }
  };

  return (
    <AnimatedPage>
      <section className="hero hero-trailer" ref={heroRef}>
        <Suspense fallback={null}>
          <HeroScene variant="full" />
        </Suspense>

        <div ref={orbRef} className="hero-orb" aria-hidden />

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          Volume I · The Veil Press
        </motion.p>

        <SplitTitle text="The Veil of the Square Mile" className="h1-book" />

        <motion.div
          className="title-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.55, ease: easeOut }}
        />

        <motion.p
          className="lede lede-glow hero-trailer-lede"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: easeOut }}
        >
          The invisible British financial empire — documented, not dramatized.
        </motion.p>

        <motion.div
          className="trailer-stage"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: easeOut }}
        >
          <div className="trailer-frame">
            <video
              ref={videoRef}
              className="trailer-video"
              src="/trailer.mp4"
              poster="/cover.jpg"
              autoPlay
              loop
              playsInline
              preload="auto"
              controls
              aria-label="Trailer for The Veil of the Square Mile"
            />
            <button
              type="button"
              className="trailer-mute"
              onClick={toggleMute}
              aria-pressed={!muted}
              aria-label={muted ? "Unmute trailer" : "Mute trailer"}
            >
              {muted ? "Unmute" : "Mute"}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="actions actions-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.9, ease: easeOut }}
        >
          {/* On-site funnel first — never straight to Gumroad from Home */}
          <MagneticLink
            className="btn btn-primary btn-shimmer"
            to="/books/square-mile#buy"
          >
            Formats &amp; bundles
          </MagneticLink>
          <MagneticLink
            className="btn btn-shimmer"
            to="/books/square-mile/companion"
          >
            Companion · watch why
          </MagneticLink>
          <MagneticLink className="btn" to="/books/square-mile">
            Enter the volume
          </MagneticLink>
        </motion.div>
      </section>

      <Reveal>
        <hr className="rule rule-pulse" />
      </Reveal>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>Featured</h2>
          </div>
        </Reveal>
        <Reveal>
          <Link
            ref={featuredRef}
            to="/books/square-mile"
            className="feature-panel feature-wow"
          >
            <div className="feature-visual">
              <img
                ref={featuredImgRef}
                src="/cover.jpg"
                alt="The Veil of the Square Mile cover"
              />
              <div className="feature-scan" aria-hidden />
            </div>
            <div className="feature-body">
              <div className="meta" style={{ marginBottom: "0.75rem" }}>
                Volume I · Available
              </div>
              <h3>The Veil of the Square Mile</h3>
              <p>
                The City of London Corporation and the invisible financial empire
                — architecture on the record, not melodrama.
              </p>
              <span
                className="btn btn-primary btn-shimmer"
                style={{ alignSelf: "flex-start" }}
              >
                Enter the volume
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>How the house works</h2>
          </div>
        </Reveal>
        <Stagger className="card-grid three">
          <StaggerItem>
            <Link className="card card-lift card-glow" to="/books/square-mile#buy">
              <div className="meta">01</div>
              <h3>The book</h3>
              <p>Continuous argument — the journey. Formats &amp; bundles.</p>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <Link
              className="card card-lift card-glow"
              to="/books/square-mile/companion"
            >
              <div className="meta">02</div>
              <h3>The Companion</h3>
              <p>
                Sources, trees, bibliography — the map. Watch why it matters.
              </p>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <div className="card card-glow">
              <div className="meta">03</div>
              <h3>The library</h3>
              <p>Reader apparatus for every Veil title — in development.</p>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      <Reveal className="section">
        <div
          className="card soon card-glow"
          style={{ textAlign: "center", padding: "2.4rem" }}
        >
          <div className="meta">Further volumes</div>
          <h3 style={{ marginBottom: "0.5rem" }}>More under The Veil</h3>
          <p style={{ margin: "0 auto", maxWidth: "28rem" }}>
            Additional institutional histories will appear on the shelf as they
            release — same imprint, same evidentiary spine.
          </p>
        </div>
      </Reveal>
    </AnimatedPage>
  );
}
