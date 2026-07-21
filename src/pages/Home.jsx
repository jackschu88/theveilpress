import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import SplitTitle from "../components/SplitTitle";
import { MagneticLink } from "../components/MagneticButton";
import { easeOut } from "../motion";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <AnimatedPage>
      <section className="hero hero-cinematic" ref={ref}>
        <motion.div
          className="hero-orb"
          style={{ y, opacity, scale }}
          aria-hidden
        />
        <motion.div
          className="hero-ring"
          aria-hidden
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.4, ease: easeOut }}
        />

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          Imprint
        </motion.p>

        <SplitTitle text="The Veil Press" />

        <motion.div
          className="title-rule"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.55, ease: easeOut }}
        />

        <motion.p
          className="lede lede-glow"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: easeOut }}
        >
          Institutional histories that strip the fog from power.
        </motion.p>

        <motion.div
          className="actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.85, ease: easeOut }}
        >
          <MagneticLink className="btn btn-primary btn-shimmer" to="/books/square-mile">
            First volume
          </MagneticLink>
          <MagneticLink className="btn" to="/books">
            Catalogue
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
          <Link to="/books/square-mile" className="feature-panel feature-wow">
            <div className="feature-visual">
              <img src="/cover.jpg" alt="The Veil of the Square Mile cover" />
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
              <span className="btn btn-primary btn-shimmer" style={{ alignSelf: "flex-start" }}>
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
          {[
            { n: "01", t: "The book", d: "Continuous argument — the journey." },
            { n: "02", t: "The Companion", d: "Sources, trees, bibliography — the map." },
            { n: "03", t: "The library", d: "Reader apparatus for every Veil title." },
          ].map((c) => (
            <StaggerItem key={c.n}>
              <div className="card card-lift card-glow">
                <div className="meta">{c.n}</div>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal className="section">
        <div className="card soon card-glow" style={{ textAlign: "center", padding: "2.4rem" }}>
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
