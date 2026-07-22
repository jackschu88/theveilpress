import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import VeilIntro from "./VeilIntro";
import Spotlight from "./Spotlight";
import FogReveal from "./FogReveal";
import GoldDust from "./GoldDust";
import SmoothScroll from "./SmoothScroll";
import Grain from "./Grain";
import CustomCursor from "./CustomCursor";
import { pageTransition } from "../motion";
import { ScrollTrigger } from "../scroll";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/books", label: "Books", end: true },
  { to: "/books/square-mile", label: "Square Mile", end: true },
  { to: "/books/square-mile/companion", label: "Companion" },
  { to: "/about", label: "About", end: true },
];

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Route transitions change page height; give the new page a frame to
    // render before recalculating ScrollTrigger's trigger positions.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <>
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
            <NavLink to="/books">Books</NavLink>
            <NavLink to="/books/square-mile/companion">Companion</NavLink>
            <NavLink to="/about">About</NavLink>
            <a
              href="https://x.com/deepdivefile"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
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
    </>
  );
}
