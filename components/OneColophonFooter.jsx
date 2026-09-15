import sealUrl from "../brand/seal.svg?url";
import "../brand/tokens.css";

export default function OneColophonFooter() {
  return (
    <footer
      className="one-colophon"
      data-colophon="ONE Trust Colophon · Idea Forge · edition 2026-09-15 · plane: public-stamp"
    >
      <img src={sealUrl} width="48" height="48" alt="ONE Trust Colophon" />
      <p>
        Idea Forge is a ONE-branded work. Guest intelligence here is sheathed: a
        named helper, not this product’s self.
      </p>
      <p className="one-motto">ALL is One and ONE is All</p>
      <p className="one-edition">
        ONE Trust Colophon · Idea Forge · edition 2026-09-15 · plane:
        public-stamp
      </p>
      <p>
        <a href="/trust">Trust</a>
        {" · "}
        <a href="/privacy">Privacy</a>
        {" · "}
        <a href="/terms">Terms</a>
      </p>
    </footer>
  );
}
