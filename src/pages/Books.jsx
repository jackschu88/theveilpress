import { lazy, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal } from "../components/Reveal";
import { gsap } from "../scroll";
import { useScrollReveal } from "../hooks/useScrollReveal";

const HeroScene = lazy(() => import("../components/HeroScene"));

export default function Books() {
  const heroRef = useRef(null);
  const listRef = useRef(null);

  useScrollReveal(
    () => {
      if (!listRef.current) return;
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 88%",
            end: "top 60%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: listRef }
  );

  return (
    <AnimatedPage>
      <div className="hero" ref={heroRef}>
        <Suspense fallback={null}>
          <HeroScene variant="light" />
        </Suspense>
        <Reveal>
          <p className="eyebrow">Catalogue</p>
          <h1>Books</h1>
          <p className="lede">
            Titles from The Veil Press. Each volume stands alone; the series shares
            a standard: institutions on the record, not cabals in the shadows.
          </p>
        </Reveal>
      </div>

      <Reveal>
        <hr className="rule" />
      </Reveal>

      <div ref={listRef}>
        <ul className="list-clean list-animated">
          <li>
            <div>
              <div className="meta" style={{ marginBottom: "0.35rem" }}>
                Volume I
              </div>
              <Link
                to="/books/square-mile"
                className="label"
                style={{ fontSize: "1.25rem" }}
              >
                The Veil of the Square Mile
              </Link>
              <p
                className="muted"
                style={{ margin: "0.4rem 0 0", maxWidth: "36rem" }}
              >
                A comprehensive analysis of the invisible British financial
                empire.
              </p>
            </div>
            <span className="value">Available</span>
          </li>
          <li className="soon">
            <div>
              <div className="meta" style={{ marginBottom: "0.35rem" }}>
                Further volumes
              </div>
              <span
                className="label"
                style={{ fontSize: "1.25rem", color: "var(--ink-muted)" }}
              >
                Forthcoming titles under The Veil
              </span>
              <p
                className="muted"
                style={{ margin: "0.4rem 0 0", maxWidth: "36rem" }}
              >
                New institutional histories will appear here as they are
                released.
              </p>
            </div>
            <span className="value">Soon</span>
          </li>
        </ul>
      </div>
    </AnimatedPage>
  );
}
