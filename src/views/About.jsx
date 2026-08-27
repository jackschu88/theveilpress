import { useRef } from "react";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal } from "../components/Reveal";
import { gsap } from "../scroll";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { SOCIALS } from "../data/socials.js";

export default function About() {
  const proseRef = useRef(null);

  useScrollReveal(
    () => {
      if (!proseRef.current) return;
      gsap.fromTo(
        proseRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: proseRef.current,
            start: "top 88%",
            end: "top 60%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope: proseRef }
  );

  return (
    <AnimatedPage>
      <Reveal>
        <p className="eyebrow">Imprint</p>
        <h1>About The Veil Press</h1>
        <p className="lede" style={{ maxWidth: "36rem" }}>
          The Veil Press publishes institutional histories — careful maps of how
          power is organized, financed, and made durable.
        </p>
      </Reveal>

      <Reveal>
        <hr className="rule" />
      </Reveal>

      <div ref={proseRef} className="prose">
        <h2>The series</h2>
        <p>
          Each volume under The Veil examines a load-bearing piece of the modern
          order: money, law, narrative, enforcement. The first title is{" "}
          <em>The Veil of the Square Mile</em>. Further volumes will follow under
          the same imprint and the same standard of evidence.
        </p>

        <h2>The author</h2>
        <p>
          Jack Schumacher writes institutional history for readers who want the
          record, not the melodrama. Claims are owned in the first person;
          incompleteness is stated when the evidence runs out.
        </p>

        <h2>Contact</h2>
        <p className="muted">
          Press and inquiries:{" "}
          <a href="mailto:deepdivefile@gmail.com">deepdivefile@gmail.com</a>
        </p>
        <h2>Follow</h2>
        <ul className="about-socials">
          {SOCIALS.map((s) => (
            <li key={s.id}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
              <span className="muted"> · {s.handle}</span>
            </li>
          ))}
        </ul>
      </div>

      <Reveal>
        <div className="actions">
          <a className="btn btn-primary" href="/#buy">
            Buy the book
          </a>
          <a
            className="btn"
            href={SOCIALS[0].href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on X
          </a>
          <a className="btn" href="/library">
            Library
          </a>
        </div>
      </Reveal>
    </AnimatedPage>
  );
}
