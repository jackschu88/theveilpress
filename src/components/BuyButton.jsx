import { MagneticAnchor, MagneticLink } from "./MagneticButton";
import {
  isHybridProduct,
  isComingSoon,
  COMING_LABEL,
  productCtaLabel,
} from "../commerce";
import { toAstroPath } from "../lib/astroPaths";
import { trackProductClick, trackCta } from "../lib/analytics";

/**
 * External checkout button — only renders primary action if URL is set.
 * Otherwise shows muted coming / pending label.
 */
export function BuyButton({
  href,
  label,
  className = "btn btn-primary btn-shimmer",
  comingSoonLabel = COMING_LABEL,
  magnetic = true,
  /** When true, never open checkout (digital/companion wait). */
  disabled = false,
  /** Optional product name/object for analytics */
  product,
  /** Extra analytics props */
  analyticsProps = {},
}) {
  const ready =
    !disabled && typeof href === "string" && href.trim().length > 0;

  if (!ready) {
    return (
      <span className="btn btn-disabled" aria-disabled="true">
        {comingSoonLabel || COMING_LABEL}
      </span>
    );
  }

  const handleClick = () => {
    trackProductClick(product || label || "checkout", {
      destination: "gumroad",
      ...analyticsProps,
    });
  };

  const props = {
    href,
    className,
    onClick: handleClick,
  };

  if (magnetic) {
    return <MagneticAnchor {...props}>{label}</MagneticAnchor>;
  }

  return <a {...props}>{label}</a>;
}

/**
 * Product CTA — live checkout. Coming-soon gate is off.
 */
export function ProductBuyButton({
  product,
  className = "btn btn-primary btn-shimmer",
  comingSoonLabel = COMING_LABEL,
  hybridLabel,
}) {
  if (!product) {
    return (
      <span className="btn btn-disabled" aria-disabled="true">
        {comingSoonLabel}
      </span>
    );
  }

  if (isComingSoon(product)) {
    return (
      <span className="btn btn-disabled" aria-disabled="true">
        {COMING_LABEL}
      </span>
    );
  }

  if (isHybridProduct(product)) {
    return (
      <MagneticLink
        to={toAstroPath(product.path) || product.path}
        className={className}
        onClick={() =>
          trackCta("hybrid_checkout", {
            product: product.name,
            path: product.path || "",
          })
        }
      >
        {hybridLabel || productCtaLabel(product) || `Continue · ${product.name}`}
      </MagneticLink>
    );
  }

  return (
    <BuyButton
      href={product.url}
      label={productCtaLabel(product)}
      className={className}
      comingSoonLabel={comingSoonLabel}
      product={product}
    />
  );
}

export function BuyLink({ to, label, className = "btn" }) {
  return (
    <MagneticLink
      to={to}
      className={className}
      onClick={() => trackCta(label || to, { href: to })}
    >
      {label}
    </MagneticLink>
  );
}
