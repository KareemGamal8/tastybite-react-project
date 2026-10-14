import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <section className="footer-brand">
          <Link to="/" className="footer-logo">
            <Icon name="chefHat" />
            Tasty<span>Bite</span>
          </Link>
          <p>
            Simple recipe discovery with smart filters, favorites, and cooking
            details for quick weeknight inspiration.
          </p>
        </section>

        <nav className="footer-links" aria-label="Footer navigation">
          <div>
            <h2>Explore</h2>
            <Link to="/">
              <Icon name="bookOpen" />
              Home
            </Link>
            <Link to="/recipes">
              <Icon name="utensils" />
              Recipes
            </Link>
            <Link to="/favorites">
              <Icon name="heart" />
              Favorites
            </Link>
          </div>

          <div>
            <h2>Social</h2>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              <Icon name="instagram" />
              Instagram
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              <Icon name="facebook" />
              Facebook
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
              <Icon name="youtube" />
              YouTube
            </a>
          </div>

          <div>
            <h2>Contact</h2>
            <a href="mailto:hello@tastybite.local">
              <Icon name="mail" />
              hello@tastybite.local
            </a>
          </div>
        </nav>
      </div>

      <div className="container footer-bottom">
        <p>Recipes from DummyJSON, built for learning React.</p>
        <p>Fresh ideas, saved favorites, happier cooking.</p>
      </div>
    </footer>
  );
}

export default Footer;
