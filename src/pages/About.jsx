import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal } from "../components/Reveal";

export default function About() {
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

      <Reveal className="prose">
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
          Press and rights inquiries: add your email when the domain is live
          (e.g.{" "}
          <code style={{ color: "var(--gold-dim)" }}>
            press@theveilpress.com
          </code>
          ).
        </p>
      </Reveal>

      <Reveal>
        <div className="actions">
          <Link className="btn btn-primary" to="/books/square-mile">
            The Veil of the Square Mile
          </Link>
          <Link className="btn" to="/books">
            All books
          </Link>
        </div>
      </Reveal>
    </AnimatedPage>
  );
}
