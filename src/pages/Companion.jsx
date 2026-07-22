import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { BuyButton } from "../components/BuyButton";
import commerce, { hasUrl } from "../commerce";
import { gsap } from "../scroll";

export default function Companion() {
  const noteRef = useRef(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      if (reduce) return;
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
    { scope: noteRef, dependencies: [reduce] }
  );

  const { pathname } = useLocation();
  const isPrint = pathname.endsWith("/print");
  const isEbook = pathname.endsWith("/ebook");

  const { fullUrl, printBuyerUrl, ebookBuyerUrl, fullLabel, buyerLabel } =
    commerce.companion;

  // Which checkout this route should emphasize
  let primaryUrl = fullUrl;
  let primaryLabel = fullLabel;
  let routeNote = "Standalone reference access.";

  if (isPrint) {
    primaryUrl = printBuyerUrl || fullUrl;
    primaryLabel = buyerLabel;
    routeNote =
      "Print book-buyer path — discounted Companion for readers who own the physical book.";
  } else if (isEbook) {
    primaryUrl = ebookBuyerUrl || printBuyerUrl || fullUrl;
    primaryLabel = buyerLabel;
    routeNote =
      "Ebook book-buyer path — discounted Companion for readers who bought the digital book.";
  }

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
        {(isPrint || isEbook) && (
          <p className="note-box" style={{ marginTop: "1.25rem" }}>
            {routeNote}
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
          </div>
        </Reveal>
        <Stagger className="price-row">
          <StaggerItem className="price-card price-glow">
            <div className="meta">Book buyers</div>
            <strong>$5.99</strong>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              Print QR or ebook receipt. Permanent discount — no monthly codes.
            </p>
            <BuyButton
              href={
                isEbook
                  ? ebookBuyerUrl || printBuyerUrl
                  : printBuyerUrl || ebookBuyerUrl
              }
              label={buyerLabel}
              comingSoonLabel="Checkout pending"
            />
          </StaggerItem>
          <StaggerItem className="price-card price-glow">
            <div className="meta">Standalone</div>
            <strong>$19.99</strong>
            <p className="muted" style={{ margin: "0 0 1rem" }}>
              Reference volume for researchers who want the apparatus without
              the narrative.
            </p>
            <BuyButton
              href={fullUrl}
              label={fullLabel}
              comingSoonLabel="Checkout pending"
            />
          </StaggerItem>
        </Stagger>

        {/* Primary CTA for this route */}
        <Reveal delay={0.06}>
          <div className="actions" style={{ marginTop: "1.25rem" }}>
            <BuyButton href={primaryUrl} label={primaryLabel} />
          </div>
        </Reveal>

        {!hasUrl(fullUrl) &&
          !hasUrl(printBuyerUrl) &&
          !hasUrl(ebookBuyerUrl) && (
            <Reveal delay={0.1}>
              <div className="commerce-placeholder" style={{ marginTop: "1.25rem" }}>
                <strong style={{ color: "var(--ink)" }}>
                  Wire Companion checkout
                </strong>
                <br />
                1. Create products on Gumroad, Lemon Squeezy, or Stripe.
                <br />
                2. Paste URLs into <code>src/commerce.js</code>:
                <br />
                &nbsp;&nbsp;<code>companion.fullUrl</code> ($19.99)
                <br />
                &nbsp;&nbsp;<code>companion.printBuyerUrl</code> ($5.99)
                <br />
                &nbsp;&nbsp;<code>companion.ebookBuyerUrl</code> ($5.99)
                <br />
                3. Redeploy. QR →{" "}
                <code>/books/square-mile/companion/print</code> uses the print
                buyer link.
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
