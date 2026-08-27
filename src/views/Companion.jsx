import { useRef } from "react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { ProductBuyButton } from "../components/BuyButton";
import { MagneticLink } from "../components/MagneticButton";
import {
  products,
  formatPrice,
} from "../commerce";
import { gsap } from "../scroll";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { trackVideoPlay } from "../lib/analytics";

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
  const physicalBundle = products.hardcoverCompanionBundle;
  const companionPdfBundle = products.bundleEbookCompanion;

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
        <h1>Companion Guide — Hardcover</h1>
        <p className="lede">You have read the argument. Here is the apparatus.</p>
        <p className="muted prose">
          Sources, timelines, dynastic trees, glossary, bibliography, appendices,
          and the steelman of objections. The main book is the journey; the
          Companion is the map. This is the physical hardcover edition.
        </p>
        {fromBookPath && (
          <p className="note-box" style={{ marginTop: "1.25rem" }}>
            From the book page. Companion Guide hardcover is {formatPrice(companion.price)}{" "}
            + $10 shipping and ships in about one week. Softcover and hardcover of
            the book ship now. The Companion PDF is in the digital bundles, instant
            after purchase.
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
              aria-label="Cinematic trailer for the Companion Guide hardcover"
              onPlay={() => trackVideoPlay("companion-trailer", { source: "companion_page" })}
            />
          </div>
          <p className="muted companion-trailer-caption">
            Companion Guide — Hardcover · {formatPrice(companion.price)} + $10 shipping
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
              Hardcover ships in about one week. Confirmation when it goes out.
              Companion Guide PDF is instant after purchase inside the digital bundles.
            </p>
          </div>
        </Reveal>
        <Stagger className="price-row">
          <StaggerItem className="price-card price-glow price-card-featured">
            <div className="meta">Hardcover · Ships in about a week</div>
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
            <div className="meta">Instant download</div>
            <strong>{formatPrice(companionPdfBundle.price)}</strong>
            <p
              style={{
                margin: "0 0 0.35rem",
                color: "var(--ink)",
                fontFamily: "Cinzel, serif",
                fontSize: "1.05rem",
              }}
            >
              {companionPdfBundle.name}
            </p>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              {companionPdfBundle.blurb} {companionPdfBundle.deliveryNote}
            </p>
            <ProductBuyButton product={companionPdfBundle} />
          </StaggerItem>
          <StaggerItem className="price-card price-glow">
            <div className="meta">Physical set</div>
            <strong>{formatPrice(physicalBundle.price)}</strong>
            <p
              style={{
                margin: "0 0 0.35rem",
                color: "var(--ink)",
                fontFamily: "Cinzel, serif",
                fontSize: "1.05rem",
              }}
            >
              {physicalBundle.name}
            </p>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              {physicalBundle.blurb} {physicalBundle.deliveryNote}
            </p>
            <ProductBuyButton
              product={physicalBundle}
              className="btn btn-primary btn-shimmer"
            />
          </StaggerItem>
        </Stagger>

        <Reveal>
          <div className="actions" style={{ marginTop: "1.25rem" }}>
            <MagneticLink className="btn" to="/library/veil#buy">
              All formats
            </MagneticLink>
            <MagneticLink className="btn btn-shimmer" to="/library/veil#buy">
              Softcover & hardcover
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
          <a className="btn" href="/library/veil#buy">
            Buy the book
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
