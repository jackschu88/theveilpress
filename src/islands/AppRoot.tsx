import type { ReactNode } from 'react';
import SoundtrackProvider from '../components/cinematic/SoundtrackProvider';
import SmoothScroll from '../components/cinematic/SmoothScroll';
import Grain from '../components/cinematic/Grain';
import CustomCursor from '../components/cinematic/CustomCursor';
import Spotlight from '../components/cinematic/Spotlight';
import FogReveal from '../components/cinematic/FogReveal';
import GoldDust from '../components/cinematic/GoldDust';
import GlobalMusicBar from '../components/cinematic/GlobalMusicBar';

interface Props {
  children: ReactNode;
}

export default function AppRoot({ children }: Props) {
  /* VeilIntro / opening curtain is sitewide in BaseLayout (once per session). */
  return (
    <SoundtrackProvider>
      <SmoothScroll />
      <Grain />
      <CustomCursor />
      <Spotlight />
      <FogReveal />
      <div className="atmosphere" aria-hidden>
        <div className="atmosphere-glow" />
        <div className="atmosphere-mesh" />
        <GoldDust />
      </div>
      {children}
      <GlobalMusicBar />
    </SoundtrackProvider>
  );
}
