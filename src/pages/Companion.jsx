import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { BuyButton } from "../components/BuyButton";
import { products, hasUrl, formatPrice } from "../commerce";
import { gsap } from "../scroll";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Companion() {
  const noteRef = useRef(null);

  useScrollReveal(
    () => {
      if (!noteRef.current) return;
      gsap.fromTo(
        noteRef.current,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          ease: "none",
          scrollTrigger: {
            trigger: noteRef.current,
            start: "top 88%",
            end: "top 60%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: noteRef }
  );

  const { pathname } = useLocation();
  const fromBookPath =
    pathname.endsWith("/print") || pathname.endsWith("/ebook");

  const companion = products.companion;
  const fullBundle = products.bundleFull;
  const storeReady = hasUrl(companion.url) || hasUrl(fullBundle.url);

  const items = [
    ["Glossary", "Defined terms from the book"],
    ["Timelines", "Institutional chronology"],
    ["Dynastic trees & families", "Servant houses, not masters"],
    ["Bibliography", "Annotated sources"],
    ["Biographies", "Key figures"],
    ["Policy citations", "2025–2026 primary trail"],
    ["Steelman", "Strongest objections and replies"],
    ["Additional dossiers", "Topics under-covered in the narrative"],
  ];

  return (
    <AnimatedPage>
      <Reveal>
        <p className="eyebrow">The Veil of the Square Mile</p>
        <h1>Companion Guide</h1>
        <p className="lede">You have read the argument. Here is the apparatus.</p>
        <p className="muted prose">
          Sources, timelines, dynastic trees, glossary, bibliography, appendices,
          and the steelman of objections. This volume is the journey; the
          Companion is the map.
        </p>
        {fromBookPath && (
          <p className="note-box" style={{ marginTop: "1.25rem" }}>
            Book-buyer path. The Companion is {formatPrice(companion.price)}{" "}
            standalone — or free inside the Full All-in-One bundle (
            {formatPrice(fullBundle.price)}: print + ebook + audiobook +
            Companion).
          </p>
        )}
      </Reveal>

      <Reveal>
        <hr className="rule" />
      </Reveal>

      <div ref={noteRef} className="section">
        <div className="note-box">
          <strong
            style={{
              color: "var(--gold)",
              display: "block",
              marginBottom: "0.35rem",
            }}
          >
            What this is not
          </strong>
          A second narrative book, a sequel chapter, or a rewrite of the main
          text. You do not need it to follow the argument. You will want it if
          you intend to verify claims, follow genealogies, or work from the
          primary trail.
        </div>
      </div>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>Access</h2>
            <p className="muted" style={{ margin: "0.5rem 0 0" }}>
              Sold on Gumroad. Instant digital delivery.
            </p>
          </div>
        </Reveal>
        <Stagger className="price-row">
          <StaggerItem className="price-card price-glow">
            <div className="meta">Standalone</div>
            <strong>{formatPrice(companion.price)}</strong>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              {companion.blurb}
            </p>
            <BuyButton
              href={companion.url}
              label={companion.label}
              comingSoonLabel="Checkout pending"
            />
          </StaggerItem>
          <StaggerItem className="price-card price-glow price-card-featured">
            <div className="meta">Best value</div>
            <strong>{formatPrice(fullBundle.price)}</strong>
            <p
              style={{
                margin: "0 0 0.35rem",
                color: "var(--ink)",
                fontFamily: "Cinzel, serif",
                fontSize: "1.05rem",
              }}
            >
              {fullBundle.name}
            </p>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              Print + ebook + audiobook — Companion included free.
            </p>
            <BuyButton
              href={fullBundle.url}
              label={fullBundle.label}
              comingSoonLabel="Checkout pending"
            />
          </StaggerItem>
        </Stagger>

        {!storeReady && (
          <Reveal delay={0.1}>
            <div className="commerce-placeholder" style={{ marginTop: "1.25rem" }}>
              <strong style={{ color: "var(--ink)" }}>
                Wire Companion checkout
              </strong>
              <br />
              1. Create on Gumroad: Companion ({formatPrice(companion.price)})
              and Full All-in-One ({formatPrice(fullBundle.price)}).
              <br />
              2. Paste URLs into <code>src/commerce.js</code>:
              <br />
              &nbsp;&nbsp;<code>products.companion.url</code>
              <br />
              &nbsp;&nbsp;<code>products.bundleFull.url</code>
              <br />
              3. Redeploy. Buttons go live automatically.
            </div>
          </Reveal>
        )}
      </section>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>Inside the Companion</h2>
          </div>
        </Reveal>
        <Reveal>
          <ul className="list-clean list-animated">
            {items.map(([label, value]) => (
              <li key={label}>
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Reveal className="section">
        <div className="actions">
          <Link className="btn" to="/books/square-mile">
            Back to the book
          </Link>
        </div>
        <p className="muted" style={{ marginTop: "1.5rem", fontSize: "1rem" }}>
          Book + Companion are the foundation. Video walkthroughs and the reader
          app are in development.
        </p>
      </Reveal>
    </AnimatedPage>
  );
}
