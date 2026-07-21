import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { Reveal } from "../components/Reveal";

export default function Books() {
  return (
    <AnimatedPage>
      <Reveal>
        <p className="eyebrow">Catalogue</p>
        <h1>Books</h1>
        <p className="lede">
          Titles from The Veil Press. Each volume stands alone; the series shares
          a standard: institutions on the record, not cabals in the shadows.
        </p>
      </Reveal>

      <Reveal>
        <hr className="rule" />
      </Reveal>

      <Reveal>
        <ul className="list-clean list-animated">
          <li>
            <div>
              <div className="meta" style={{ marginBottom: "0.35rem" }}>
                Volume I
              </div>
              <Link
                to="/books/square-mile"
                className="label"
                style={{ fontSize: "1.25rem" }}
              >
                The Veil of the Square Mile
              </Link>
              <p
                className="muted"
                style={{ margin: "0.4rem 0 0", maxWidth: "36rem" }}
              >
                A comprehensive analysis of the invisible British financial
                empire.
              </p>
            </div>
            <span className="value">Available</span>
          </li>
          <li className="soon">
            <div>
              <div className="meta" style={{ marginBottom: "0.35rem" }}>
                Further volumes
              </div>
              <span
                className="label"
                style={{ fontSize: "1.25rem", color: "var(--ink-muted)" }}
              >
                Forthcoming titles under The Veil
              </span>
              <p
                className="muted"
                style={{ margin: "0.4rem 0 0", maxWidth: "36rem" }}
              >
                New institutional histories will appear here as they are
                released.
              </p>
            </div>
            <span className="value">Soon</span>
          </li>
        </ul>
      </Reveal>
    </AnimatedPage>
  );
}
