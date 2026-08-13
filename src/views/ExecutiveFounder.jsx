import { motion } from "framer-motion";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { BuyButton } from "../components/BuyButton";
import { MagneticLink } from "../components/MagneticButton";
import {
  PRESALE,
  EXECUTIVE_VALUE_STACK,
  EXECUTIVE_TOTAL_SOLO,
  EXECUTIVE_PRICE,
  EXECUTIVE_SAVINGS,
  EXECUTIVE_SAVINGS_PCT,
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
    desc: "Digital Edition (ebook), audiobook, and Companion PDF — Gumroad pre-order; delivery at launch / campaign timeline.",
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
  const savings = EXECUTIVE_SAVINGS;
  const savingsPct = EXECUTIVE_SAVINGS_PCT;

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
              Limited Edition
            </motion.span>

            <motion.h1
              className="exec-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            >
              Limited Founders Edition
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
              Signed hardcover book, signed hardcover Companion Guide, and every
              digital format — numbered. The trailers on the home page explain
              the book; this page is the complete set.
            </motion.p>

            <motion.div
              className="exec-price-block"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: easeOut }}
            >
              <span className="exec-price">{formatPrice(EXECUTIVE_PRICE)}</span>
              <span className="exec-shipping">Free shipping</span>
              <span className="exec-compare">
                <span className="exec-strikethrough">{formatPrice(EXECUTIVE_TOTAL_SOLO)}</span>
                <span className="exec-save">
                  Save {formatPrice(savings)} ({savingsPct}% off)
                </span>
              </span>
            </motion.div>

            <motion.div
              className="actions"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7, ease: easeOut }}
            >
              <BuyButton
                href={PRESALE.executiveFounderPack.url}
                label={`Pre-order Limited Founders · ${formatPrice(EXECUTIVE_PRICE)}`}
                comingSoonLabel="Pre-order link pending"
                className="btn btn-primary btn-shimmer btn-exec"
                product={PRESALE.executiveFounderPack}
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
          <h2 className="exec-section-headline">What you receive</h2>
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

      <section className="section exec-value-section">
        <Reveal>
          <h2 className="exec-section-headline">The value</h2>
          <p className="exec-section-sub">
            What each piece costs on its own (product + shipping where it applies)
            vs. the Limited Founders pack price.
          </p>
        </Reveal>
        <Reveal>
          <div className="exec-value-card">
            <div className="exec-value-header">
              <span>Item</span>
              <span>Solo price</span>
            </div>
            {EXECUTIVE_VALUE_STACK.map((v) => (
              <div key={v.item} className="exec-value-row">
                <span>
                  {v.item}
                  {v.detail ? (
                    <span
                      className="muted"
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 400,
                        marginTop: "0.15rem",
                      }}
                    >
                      {v.detail}
                    </span>
                  ) : null}
                </span>
                <span className={v.solo != null ? "" : "exec-included"}>
                  {v.solo != null ? formatPrice(v.solo) : "Included"}
                </span>
              </div>
            ))}
            <div className="exec-value-total">
              <span>Total if purchased separately</span>
              <span className="exec-strikethrough">{formatPrice(EXECUTIVE_TOTAL_SOLO)}</span>
            </div>
            <div className="exec-value-total exec-value-final">
              <span>Limited Founders Edition · Free shipping</span>
              <span style={{ color: "var(--gold-bright)" }}>{formatPrice(EXECUTIVE_PRICE)}</span>
            </div>
            <div className="exec-value-save">
              <span>You save</span>
              <span>
                {formatPrice(savings)} ({savingsPct}% off)
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section">
        <div className="exec-limited-section">
          <Reveal>
            <div className="exec-limited-badge">Limited numbered edition</div>
            <h2 className="exec-limited-title">One print run. Numbered. Never reprinted.</h2>
            <p className="exec-limited-desc">
              The Limited Founders Edition is a single limited run. Each set is
              individually numbered; both hardcovers are signed. When they are gone,
              this edition closes permanently.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section exec-purchase" id="purchase">
        <Reveal>
          <div className="exec-purchase-card">
            <p className="exec-purchase-eyebrow">Presale through August 26, 2026</p>
            <h2 className="exec-purchase-title">Pre-order your Limited Founders Edition</h2>
            <p className="exec-purchase-price">
              <span className="exec-price">{formatPrice(EXECUTIVE_PRICE)}</span>
              <span className="exec-shipping">Free shipping</span>
              <span className="exec-compare">
                <span className="exec-strikethrough">{formatPrice(EXECUTIVE_TOTAL_SOLO)}</span>
                <span className="exec-save">
                  Save {formatPrice(savings)} ({savingsPct}% off)
                </span>
              </span>
            </p>
            <div className="actions" style={{ justifyContent: "center" }}>
              <BuyButton
                href={PRESALE.executiveFounderPack.url}
                label={`Pre-order Limited Founders · ${formatPrice(EXECUTIVE_PRICE)}`}
                comingSoonLabel="Pre-order link pending"
                className="btn btn-primary btn-shimmer btn-exec btn-exec-lg"
                product={PRESALE.executiveFounderPack}
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
