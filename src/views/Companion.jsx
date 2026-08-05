import { useRef } from "react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { ProductBuyButton } from "../components/BuyButton";
import { MagneticLink } from "../components/MagneticButton";
import {
  products,
  formatPrice,
  COMING_LABEL,
  PRESALE_ENDS_LABEL,
} from "../commerce";
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

  // Astro multi-page: no react-router. print/ebook deep-links redirect to /library/map.
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const fromBookPath =
    pathname.endsWith("/print") || pathname.endsWith("/ebook");

  const companion = products.companion;
  const fullBundle = products.bundleFull;

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
          and the steelman of objections. The main book is the journey; the
          Companion is the map.
        </p>
        {fromBookPath && (
          <p className="note-box" style={{ marginTop: "1.25rem" }}>
            From the book page. Companion Guide ({formatPrice(companion.price)})
            and digital formats are {COMING_LABEL}. Softcover, hardcover, and
            both Founders editions are on presale through {PRESALE_ENDS_LABEL}.
            Limited Founders includes signed Companion + all digital.
          </p>
        )}
      </Reveal>

      <Reveal>
        <div className="trailer-stage companion-trailer">
          <div className="trailer-frame companion-trailer-frame">
            <video
              className="trailer-video"
              src="/videos/companion_trailer.mp4"
              poster="/companion-cover.jpg"
              controls
              playsInline
              preload="metadata"
              aria-label="Cinematic trailer for the Companion Guide"
            />
          </div>
          <p className="muted companion-trailer-caption">
            Companion Guide · {formatPrice(companion.price)} + $5 shipping
          </p>
        </div>
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
            <h2>Get the Companion</h2>
            <p className="muted" style={{ margin: "0.5rem 0 0" }}>
              Standalone Companion and digital bundles are {COMING_LABEL}. Pre-order
              Limited Founders now for signed Companion + all digital + signed book.
            </p>
          </div>
        </Reveal>
        <Stagger className="price-row">
          <StaggerItem className="price-card price-glow">
            <div className="meta">{COMING_LABEL}</div>
            <strong>{formatPrice(companion.price)}</strong>
            <p
              style={{
                margin: "0 0 0.35rem",
                color: "var(--ink)",
                fontFamily: "Cinzel, serif",
                fontSize: "1.05rem",
              }}
            >
              {companion.name}
            </p>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              {companion.blurb}
            </p>
            <ProductBuyButton product={companion} />
          </StaggerItem>
          <StaggerItem className="price-card price-glow">
            <div className="meta">{COMING_LABEL}</div>
            <strong>{formatPrice(products.bundleEbookCompanion.price)}</strong>
            <p
              style={{
                margin: "0 0 0.35rem",
                color: "var(--ink)",
                fontFamily: "Cinzel, serif",
                fontSize: "1.05rem",
              }}
            >
              {products.bundleEbookCompanion.name}
            </p>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              {products.bundleEbookCompanion.blurb}
            </p>
            <ProductBuyButton product={products.bundleEbookCompanion} />
          </StaggerItem>
          <StaggerItem className="price-card price-glow price-card-featured">
            <div className="meta">On presale · Recommended</div>
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
              {fullBundle.blurb}
            </p>
            <ProductBuyButton
              product={fullBundle}
              className="btn btn-primary btn-shimmer"
              hybridLabel={`Pre-order Limited Founders · ${formatPrice(fullBundle.price)}`}
            />
          </StaggerItem>
        </Stagger>

        <Reveal>
          <div className="actions" style={{ marginTop: "1.25rem" }}>
            <MagneticLink className="btn" to="/library/founders">
              Founders &amp; limited
            </MagneticLink>
            <MagneticLink className="btn btn-shimmer" to="/library/veil#buy">
              Softcover &amp; hardcover presale
            </MagneticLink>
          </div>
        </Reveal>
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
          <a className="btn" href="/library/founders">
            Pre-order
          </a>
        </div>
        <p className="muted" style={{ marginTop: "1.5rem", fontSize: "1rem" }}>
          Book + Companion are the foundation. Video walkthroughs and the reader
          app are in development.
        </p>
      </Reveal>
    </AnimatedPage>
  );
}
