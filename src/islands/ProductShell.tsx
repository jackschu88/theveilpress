/**
 * Product pages under Library — light atmosphere + soundtrack.
 * Curtain open lives in LibraryLayout (once per session). No grain / FogReveal.
 */
import type { ReactNode } from 'react';
import SoundtrackProvider from '../components/cinematic/SoundtrackProvider';
import GoldDust from '../components/cinematic/GoldDust';
import GlobalMusicBar from '../components/cinematic/GlobalMusicBar';

interface Props {
  children: ReactNode;
}

export default function ProductShell({ children }: Props) {
  return (
    <SoundtrackProvider>
      <div className="product-shell" data-product-shell>
        <div className="product-atmosphere" aria-hidden>
          <div className="product-fog product-fog--a" />
          <div className="product-fog product-fog--b" />
          <div className="atmosphere-glow" />
          <GoldDust count={28} />
        </div>

        <div className="product-shell-content shell">{children}</div>
        <GlobalMusicBar />
      </div>
    </SoundtrackProvider>
  );
}
