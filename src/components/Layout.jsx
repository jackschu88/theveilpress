import { useEffect, useLayoutEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Spotlight from "./Spotlight";
import FogReveal from "./FogReveal";
import GoldDust from "./GoldDust";
import SmoothScroll from "./SmoothScroll";
import Grain from "./Grain";
import CustomCursor from "./CustomCursor";
import SoundtrackProvider from "./SoundtrackProvider";
import GlobalMusicBar from "./GlobalMusicBar";
import { pageTransition } from "../motion";
import { ScrollTrigger, scrollToTop } from "../scroll";

const links = [
  { to: "/", label: "Pre-order", end: true },
  { to: "/home", label: "Film", end: true },
  { to: "/about", label: "About", end: true },
];

export default function Layout() {
  const location = useLocation();

  // Always start each route at the top (unless a hash targets a section).
  // Without this, Lenis + SPA navigation leaves the previous page's scroll
  // offset, so the new page opens mid-way down.
  useLayoutEffect(() => {
    if (location.hash) return;
    scrollToTop();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // Route transitions change page height; give the new page a frame to
    // render before recalculating ScrollTrigger's trigger positions.
    const id = requestAnimationFrame(() => {
      if (!location.hash) scrollToTop();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.hash]);

  return (
    <SoundtrackProvider>
      <SmoothScroll />
      <Grain />
      <CustomCursor />
      {/* VeilIntro is sitewide in BaseLayout (Astro) once per session */}
      <Spotlight />
      <FogReveal />
      <div className="atmosphere" aria-hidden>
        <div className="atmosphere-glow" />
        <div className="atmosphere-mesh" />
        <GoldDust />
      </div>

      <header className="site-header">
        <div className="shell nav-inner">
          <NavLink to="/" className="brand">
            The Veil <span>Press</span>
          </NavLink>
          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            style={{ minHeight: "55vh" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <GlobalMusicBar />

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div>
            <p className="brand" style={{ marginBottom: "0.5rem" }}>
              The Veil Press
            </p>
            <p>
              Institutional histories. The fog removed.
              <br />© {new Date().getFullYear()} Jack Schumacher
              <br />
              <a href="mailto:deepdivefile@gmail.com">deepdivefile@gmail.com</a>
            </p>
          </div>
          <div className="footer-links">
            <NavLink to="/">Pre-order</NavLink>
            <NavLink to="/home">Film</NavLink>
            <NavLink to="/about">About</NavLink>
            <a
              href="https://x.com/deepdivefile"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
            <a
              href="https://www.youtube.com/channel/UC1inbgx19VivnXyWGDWbaiw"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
            <a
              href="https://www.tiktok.com/@theveilpress"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61592600831684"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </div>
        </div>
        <div className="shell" style={{ marginTop: "1.5rem" }}>
          <p className="muted" style={{ fontSize: "0.95rem", margin: 0 }}>
            Book + Companion are the foundation. Video walkthroughs and the
            reader app are in development.
          </p>
        </div>
      </footer>
    </SoundtrackProvider>
  );
}
