import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import SplitTitle from "../components/SplitTitle";
import TiltCover from "../components/TiltCover";
import TrailerPlayer from "../components/TrailerPlayer";
import { BuyButton } from "../components/BuyButton";
import { MagneticLink } from "../components/MagneticButton";
import MusicPlayer from "../components/MusicPlayer";
import { PRESALE, formatPrice, COMING_LABEL, PRESALE_ENDS_LABEL } from "../commerce";
import { easeOut } from "../motion";

const HeroScene = lazy(() => import("../components/HeroScene"));

/** Print, Companion hardcover, physical bundle, and both Founders are buyable now. */
const presaleItems = [
  { ...PRESALE.softcover, badge: "Presale" },
  { ...PRESALE.hardcover, badge: "Presale" },
  { ...PRESALE.companionHardcover, badge: "Companion · Presale" },
  {
    ...PRESALE.hardcoverCompanionBundle,
    badge: "Physical set · Presale",
    featured: true,
  },
  { ...PRESALE.foundersPack, badge: "Founders Edition", featured: true },
  { ...PRESALE.executiveFounderPack, badge: "Limited Founders", featured: true, dedicated: true },
];

export default function Presale() {
  return (
    <AnimatedPage>
      {/* Film first — the Square Mile trailer is the opening impression */}
      <section className="presale-trailer-hero" aria-label="The Veil of the Square Mile trailer">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: easeOut }}
        >
          <TrailerPlayer
            frameClassName="presale-trailer-frame"
            ariaLabel="Trailer for The Veil of the Square Mile"
          />
        </motion.div>
      </section>

      <section className="hero hero-grid hero-book">
        <Suspense fallback={null}>
          <HeroScene variant="light" />
        </Suspense>
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: easeOut }}
          >
            Pre-order · Volume I
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
            Pre-order the first volume from The Veil Press.
          </motion.p>

          <motion.p
            className="muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            style={{ marginTop: "0.35rem" }}
          >
            Jack Schumacher
          </motion.p>
        </div>

        <TiltCover
          src="/cover.jpg"
          alt="Cover of The Veil of the Square Mile"
        />
      </section>

      <Reveal>
        <hr className="rule rule-pulse" />
      </Reveal>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>Pre-order now</h2>
            <p className="muted" style={{ margin: "0.5rem 0 0", maxWidth: "36rem" }}>
              Softcover, hardcover, Companion Guide, Hardcover + Companion
              bundle, and both Founders editions — on presale through{" "}
              {PRESALE_ENDS_LABEL}. Digital formats: {COMING_LABEL}.
            </p>
          </div>
        </Reveal>

        <Stagger className="price-row">
          {presaleItems.map((item) => (
            <StaggerItem
              key={item.name}
              className={`price-card price-glow${item.featured ? " price-card-featured" : ""}`}
            >
              <div className="meta">{item.badge}</div>
              <strong>{formatPrice(item.price)}</strong>
              {item.shippingNote ? (
                <p
                  className="muted"
                  style={{
                    margin: "0.15rem 0 0",
                    fontSize: "0.85rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.shippingNote}
                </p>
              ) : null}
              <p
                style={{
                  margin: "0.35rem 0 0.35rem",
                  color: "var(--ink)",
                  fontFamily: "Cinzel, serif",
                  fontSize: "1.05rem",
                }}
              >
                {item.name}
              </p>
              <p className="muted" style={{ margin: "0 0 1rem" }}>
                {item.blurb}
              </p>
              {item.dedicated ? (
                <MagneticLink
                  to="/presale/executive"
                  className="btn btn-primary btn-shimmer"
                >
                  View Limited Founders Edition
                </MagneticLink>
              ) : (
                <BuyButton
                  href={item.url}
                  label={`Pre-order · ${formatPrice(item.price)}`}
                  comingSoonLabel="Pre-order link pending"
                  className="btn btn-primary btn-shimmer"
                />
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>Songs from the resistance</h2>
            <p className="muted" style={{ margin: "0.5rem 0 0", maxWidth: "36rem" }}>
              Listen while you decide. Playback continues as you browse the site.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <MusicPlayer />
        </Reveal>
      </section>

      <Reveal className="section">
        <div
          className="card soon card-glow"
          style={{ textAlign: "center", padding: "2.4rem" }}
        >
          <h3 style={{ marginBottom: "0.5rem" }}>About the presale</h3>
          <p style={{ margin: "0 auto", maxWidth: "28rem" }}>
            Softcover, hardcover, Companion Guide hardcover, the Hardcover +
            Companion physical bundle, Founders Edition, and Limited Founders are
            on presale through {PRESALE_ENDS_LABEL}. Print is manufactured on
            demand; you will be notified when your order ships. Digital formats
            are {COMING_LABEL} — Limited Founders includes signed Companion plus
            the full digital set now.
          </p>
        </div>
      </Reveal>
    </AnimatedPage>
  );
}
