import { MagneticAnchor, MagneticLink } from "./MagneticButton";

/**
 * External checkout button — only renders primary action if URL is set.
 * Otherwise shows muted "Coming soon".
 */
export function BuyButton({
  href,
  label,
  className = "btn btn-primary btn-shimmer",
  comingSoonLabel = "Coming soon",
  magnetic = true,
}) {
  const ready = typeof href === "string" && href.trim().length > 0;

  if (!ready) {
    return (
      <span className="btn btn-disabled" aria-disabled="true">
        {comingSoonLabel}
      </span>
    );
  }

  const props = {
    href,
    className,
    target: "_blank",
    rel: "noopener noreferrer",
  };

  if (magnetic) {
    return <MagneticAnchor {...props}>{label}</MagneticAnchor>;
  }

  return <a {...props}>{label}</a>;
}

export function BuyLink({ to, label, className = "btn" }) {
  return (
    <MagneticLink to={to} className={className}>
      {label}
    </MagneticLink>
  );
}
