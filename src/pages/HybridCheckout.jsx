import { Link, Navigate, useParams } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal, Stagger, StaggerItem } from "../components/Reveal";
import { BuyButton } from "../components/BuyButton";
import { MagneticLink } from "../components/MagneticButton";
import {
  hybridPlans,
  formatPrice,
  hasUrl,
} from "../commerce";

const CHANNEL_META = {
  ingram: {
    eyebrow: "Step · Print",
    platform: "IngramSpark",
    note: "Physical book — ships to your address.",
  },
  gumroad: {
    eyebrow: "Step · Digital",
    platform: "Gumroad",
    note: "Instant delivery to your email.",
  },
};

export default function HybridCheckout() {
  const { planId } = useParams();
  const plan = hybridPlans[planId];

  if (!plan) {
    return <Navigate to="/books/square-mile#buy" replace />;
  }

  const stepTotal = plan.steps.reduce((sum, s) => sum + s.price, 0);
  const anyStepReady = plan.steps.some((s) => hasUrl(s.url));

  return (
    <AnimatedPage>
      <Reveal>
        <p className="eyebrow">Two platforms · one complete set</p>
        <h1>{plan.name}</h1>
        <p className="lede">
          Print and digital live on different storefronts. Complete both steps
          below — order takes a minute each.
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
          The paperback is fulfilled through IngramSpark. Digital Edition,
          audiobook, and Companion Guide are sold on Gumroad for instant
          download. No single cart can process both — this path walks you
          through each side in order.
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
                  comingSoonLabel={
                    step.channel === "ingram"
                      ? "Print link pending"
                      : "Checkout pending"
                  }
                  className="btn btn-primary btn-shimmer"
                />
                {!ready && step.channel === "ingram" && (
                  <p className="muted" style={{ margin: "0.75rem 0 0", fontSize: "0.95rem" }}>
                    Print storefront link coming soon. Digital step is available
                    now if you already have the book (or will order separately).
                  </p>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>

        {!anyStepReady && (
          <Reveal>
            <p className="muted" style={{ marginTop: "1.5rem" }}>
              Checkout links are still being connected. Digital Gumroad SKUs may
              already be live from the main buy section.
            </p>
          </Reveal>
        )}
      </section>

      <Reveal className="section">
        <div className="actions">
          <MagneticLink className="btn" to="/books/square-mile#buy">
            All formats &amp; bundles
          </MagneticLink>
          <Link className="btn btn-shimmer" to="/books/square-mile/companion">
            Companion · watch why
          </Link>
        </div>
      </Reveal>
    </AnimatedPage>
  );
}
