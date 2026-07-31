import { MagneticAnchor } from "../cinematic/MagneticButton";
import { isHybridProduct } from "../../commerce";

interface Product {
  name: string;
  label: string;
  url: string;
  path?: string;
  checkout?: string;
}

export function BuyButton({
  href,
  label,
  className = "btn btn-primary btn-shimmer",
  comingSoonLabel = "Coming soon",
  magnetic = true,
}: {
  href: string;
  label: string;
  className?: string;
  comingSoonLabel?: string;
  magnetic?: boolean;
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

export function ProductBuyButton({
  product,
  className = "btn btn-primary btn-shimmer",
  comingSoonLabel = "Checkout pending",
  hybridLabel,
}: {
  product: Product | null;
  className?: string;
  comingSoonLabel?: string;
  hybridLabel?: string;
}) {
  if (!product) {
    return (
      <span className="btn btn-disabled" aria-disabled="true">
        {comingSoonLabel}
      </span>
    );
  }

  if (isHybridProduct(product)) {
    return (
      <a href={product.path} className={className}>
        {hybridLabel || `Continue · ${product.name}`}
      </a>
    );
  }

  return (
    <BuyButton
      href={product.url}
      label={product.label}
      className={className}
      comingSoonLabel={comingSoonLabel}
    />
  );
}

export function BuyLink({ to, label, className = "btn" }: { to: string; label: string; className?: string }) {
  return (
    <a href={to} className={className}>
      {label}
    </a>
  );
}
