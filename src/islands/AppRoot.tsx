import type { ReactNode } from 'react';
import SoundtrackProvider from '../components/cinematic/SoundtrackProvider';
import SmoothScroll from '../components/cinematic/SmoothScroll';
import Grain from '../components/cinematic/Grain';
import CustomCursor from '../components/cinematic/CustomCursor';
import VeilIntro from '../components/cinematic/VeilIntro';
import Spotlight from '../components/cinematic/Spotlight';
import FogReveal from '../components/cinematic/FogReveal';
import GoldDust from '../components/cinematic/GoldDust';
import GlobalMusicBar from '../components/cinematic/GlobalMusicBar';

interface Props {
  children: ReactNode;
}

export default function AppRoot({ children }: Props) {
  return (
    <SoundtrackProvider>
      <SmoothScroll />
      <Grain />
      <CustomCursor />
      <VeilIntro />
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
