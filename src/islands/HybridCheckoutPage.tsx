import AppRoot from './AppRoot';
import HybridCheckout from '../components/commerce/HybridCheckout';

export default function HybridCheckoutPage({ planId }: { planId: string }) {
  return <AppRoot><HybridCheckout planId={planId} /></AppRoot>;
}
