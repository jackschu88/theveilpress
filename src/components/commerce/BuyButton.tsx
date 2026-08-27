import { MagneticAnchor } from "../cinematic/MagneticButton";
import {
  isHybridProduct,
  isComingSoon,
  COMING_LABEL,
  productCtaLabel,
} from "../../commerce";

interface Product {
  name: string;
  label: string;
  url: string;
  path?: string;
  checkout?: string;
  saleStatus?: "live" | "closed" | "presale" | "coming";
}

export function BuyButton({
  href,
  label,
  className = "btn btn-primary btn-shimmer",
  comingSoonLabel = COMING_LABEL,
  magnetic = true,
  disabled = false,
}: {
  href: string;
  label: string;
  className?: string;
  comingSoonLabel?: string;
  magnetic?: boolean;
  disabled?: boolean;
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

  const props = {
    href,
    className,
  };

  if (magnetic) {
    return <MagneticAnchor {...props}>{label}</MagneticAnchor>;
  }

  return <a {...props}>{label}</a>;
}

export function ProductBuyButton({
  product,
  className = "btn btn-primary btn-shimmer",
  comingSoonLabel = COMING_LABEL,
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

  if (isComingSoon(product)) {
    return (
      <span className="btn btn-disabled" aria-disabled="true">
        {COMING_LABEL}
      </span>
    );
  }

  if (isHybridProduct(product)) {
    return (
      <a href={product.path} className={className}>
        {hybridLabel || productCtaLabel(product) || `Continue · ${product.name}`}
      </a>
    );
  }

  return (
    <BuyButton
      href={product.url}
      label={productCtaLabel(product)}
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
