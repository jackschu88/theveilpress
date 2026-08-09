import AnimatedPage from "../cinematic/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../cinematic/Reveal";
import { BuyButton } from "./BuyButton";
import {
  hybridPlans,
  formatPrice,
  hasUrl,
  COMING_LABEL,
  isComingSoon,
} from "../../commerce";

const CHANNEL_META: Record<string, { eyebrow: string; platform: string; note: string }> = {
  ingram: {
    eyebrow: "Step · Print",
    platform: "IngramSpark",
    note: "Physical book — ships after the presale window (through August 26, 2026).",
  },
  gumroad: {
    eyebrow: "Step · Gumroad",
    platform: "Gumroad",
    note: "Print and Companion hardcover on presale; digital SKUs Coming August 26th unless part of Limited Founders.",
  },
};

export default function HybridCheckout({ planId }: { planId: string }) {
  const plan = hybridPlans[planId];

  if (!plan) {
    return null;
  }

  const stepTotal = plan.steps.reduce((sum, s) => sum + s.price, 0);
  const anyStepReady = plan.steps.some((s) => hasUrl(s.url));

  return (
    <AnimatedPage>
      <Reveal>
        <p className="eyebrow">Two platforms · one complete set</p>
        <h1>{plan.name}</h1>
        <p className="lede">
          Softcover and Companion hardcover are on presale now via Gumroad.
          Digital-only steps remain {COMING_LABEL}. Prefer everything in one cart?
          Pre-order Limited Founders.
        </p>
        <p className="muted prose">
          {plan.blurb} Combined storefront total{" "}
          <strong style={{ color: "var(--gold)" }}>
            {formatPrice(plan.price)}
          </strong>
          {Math.abs(stepTotal - plan.price) > 0.02 && (
            <>
              {" "}
              (steps add to {formatPrice(stepTotal)}).
            </>
          )}
        </p>
      </Reveal>

      <Reveal>
        <div className="note-box" style={{ marginTop: "1.25rem" }}>
          <strong
            style={{
              color: "var(--gold)",
              display: "block",
              marginBottom: "0.35rem",
            }}
          >
            Why two checkouts?
          </strong>
          Softcover and Companion hardcover are on Gumroad presale now (separate
          checkouts). Standalone digital formats are {COMING_LABEL}. Limited
          Founders is the one-cart path that includes signed hardcovers plus
          digital today.
        </div>
      </Reveal>

      <Reveal>
        <hr className="rule" />
      </Reveal>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <h2>Your path</h2>
            <p className="muted" style={{ margin: "0.5rem 0 0", maxWidth: "36rem" }}>
              Do step 1, then step 2. Either order first is fine if you already
              own one side.
            </p>
          </div>
        </Reveal>

        <Stagger className="hybrid-steps">
          {plan.steps.map((step, index) => {
            const meta = CHANNEL_META[step.channel] || CHANNEL_META.gumroad;
            const ready = hasUrl(step.url);
            return (
              <StaggerItem key={step.id} className="card card-glow hybrid-step">
                <div className="meta">
                  {meta.eyebrow} · {index + 1} of {plan.steps.length}
                </div>
                <h3 style={{ margin: "0.35rem 0 0.5rem" }}>{step.title}</h3>
                <p className="muted" style={{ margin: "0 0 0.75rem" }}>
                  {step.detail}
                </p>
                <p
                  style={{
                    margin: "0 0 1rem",
                    fontFamily: "Cinzel, serif",
                    fontSize: "1.35rem",
                    color: "var(--gold)",
                  }}
                >
                  {formatPrice(step.price)}
                  <span
                    className="muted"
                    style={{
                      display: "block",
                      fontFamily: "Source Sans 3, system-ui, sans-serif",
                      fontSize: "0.85rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginTop: "0.25rem",
                    }}
                  >
                    via {meta.platform} · {meta.note}
                  </span>
                </p>
                <BuyButton
                  href={step.url}
                  label={step.label}
                  disabled={isComingSoon(step)}
                  comingSoonLabel={
                    isComingSoon(step)
                      ? COMING_LABEL
                      : step.channel === "ingram"
                        ? "Print pre-order link pending"
                        : "Pre-order link pending"
                  }
                  className="btn btn-primary btn-shimmer"
                />
                {isComingSoon(step) && (
                  <p className="muted" style={{ margin: "0.75rem 0 0", fontSize: "0.95rem" }}>
                    {COMING_LABEL}. Softcover is on presale alone, or pre-order
                    Limited Founders for the complete set.
                  </p>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>

        {!anyStepReady && (
          <Reveal>
            <p className="muted" style={{ marginTop: "1.5rem" }}>
              Pre-order links are still being connected. Digital Gumroad SKUs may
              already be live from the main pre-order section.
            </p>
          </Reveal>
        )}
      </section>

      <Reveal className="section">
        <div className="actions">
          <a className="btn" href="/books/square-mile#buy">
            All formats &amp; bundles
          </a>
          <a className="btn btn-shimmer" href="/books/square-mile/companion">
            Companion · watch why
          </a>
        </div>
      </Reveal>
    </AnimatedPage>
  );
}
