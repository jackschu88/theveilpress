import ProductShell from './ProductShell';
import HybridCheckout from '../components/commerce/HybridCheckout';

export default function HybridCheckoutPage({ planId }: { planId: string }) {
  return (
    <ProductShell>
      <HybridCheckout planId={planId} />
    </ProductShell>
  );
}
