import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { BuyButton } from "../components/BuyButton";
import { MagneticLink } from "../components/MagneticButton";
import {
  products,
  formatPrice,
} from "../commerce";
import { easeOut } from "../motion";

const included = [
  {
    title: "Signed Hardcover Book",
    desc: "First-edition hardcover of The Veil of the Square Mile, personally signed by Jack Schumacher.",
  },
  {
    title: "Signed Hardcover Companion Guide",
    desc: "The full apparatus in hardcover — glossary, timelines, dynastic trees, bibliography, steelman — also signed.",
  },
  {
    title: "All Digital Assets",
    desc: "Digital Edition (ebook), audiobook, and Companion PDF — delivered with the original seed-run set.",
  },
  {
    title: "Personal Message",
    desc: "A short handwritten message from the author, included with your order.",
  },
  {
    title: "Companion Extension",
    desc: "Exclusive bonus chapter — not available in the standard Companion edition.",
  },
  {
    title: "Numbered Edition",
    desc: "One of a limited run. Your copy is individually numbered. No reprints.",
  },
];

export default function ExecutiveFounder() {
  const signed = products.signedHardcover;

  return (
    <AnimatedPage>
      <section className="exec-hero-composite" aria-label="Limited Founders Edition">
        <div className="exec-hero-stage">
          <img
            className="exec-hero-photo"
            src="/limited-founders-hero-wide.jpg"
            alt="The Veil of the Square Mile hardcover on marble pedestal"
          />
          <div className="exec-hero-shade" aria-hidden />

          <motion.div
            className="exec-hero-glass"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: easeOut }}
          >
            <motion.span
              className="exec-badge"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              Seed run closed
            </motion.span>

            <motion.h1
              className="exec-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            >
              The Founders seed run is closed
            </motion.h1>

            <motion.div
              className="title-rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: easeOut }}
            />

            <motion.p
              className="exec-lede"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: easeOut }}
            >
              Signed hardcovers of the book are available while the current short
              run of 25 lasts. Softcover and hardcover ship now. The Companion
              Guide hardcover follows in about a week.
            </motion.p>

            <motion.div
              className="exec-price-block"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: easeOut }}
            >
              <span className="exec-price">{formatPrice(signed.price)}</span>
              <span className="exec-shipping">Signed hardcover · includes $5 shipping</span>
            </motion.div>

            <motion.div
              className="actions"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: easeOut }}
            >
              <BuyButton
                href={signed.url}
                label={signed.label}
                className="btn btn-primary btn-shimmer btn-exec"
                product={signed}
              />
              <MagneticLink className="btn" to="/#buy">
                All formats
              </MagneticLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <Reveal>
          <h2 className="exec-section-headline">What the seed run included</h2>
        </Reveal>
        <Stagger className="exec-included-grid">
          {included.map((item) => (
            <StaggerItem key={item.title} className="exec-included-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="section">
        <div className="exec-limited-section">
          <Reveal>
            <div className="exec-limited-badge">Closed</div>
            <h2 className="exec-limited-title">The seed run is closed.</h2>
            <p className="exec-limited-desc">
              Signed hardcovers of the book are available while the current short
              run lasts. Softcover and hardcover ship now. Companion Guide hardcover
              follows in about one week.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section exec-purchase" id="purchase">
        <Reveal>
          <div className="exec-purchase-card">
            <p className="exec-purchase-eyebrow">Short run · 25 on hand</p>
            <h2 className="exec-purchase-title">Signed hardcover</h2>
            <p className="exec-purchase-price">
              <span className="exec-price">{formatPrice(signed.price)}</span>
              <span className="exec-shipping">Includes $5 shipping. Ships now. Signed before ship.</span>
            </p>
            <div className="actions" style={{ justifyContent: "center" }}>
              <BuyButton
                href={signed.url}
                label={signed.label}
                className="btn btn-primary btn-shimmer btn-exec btn-exec-lg"
                product={signed}
              />
              <MagneticLink className="btn" to="/#buy">
                All formats
              </MagneticLink>
            </div>
          </div>
        </Reveal>
      </section>
    </AnimatedPage>
  );
}
