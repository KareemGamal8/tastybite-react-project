import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";

function Navbar({ user, authLoading, onLogout }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function handleLogoutClick() {
    onLogout();
    closeMobileMenu();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-mark">
            <Icon name="chefHat" />
          </span>
          Tasty<span>Bite</span>
        </Link>

        <nav className={`nav-links ${isMobileMenuOpen ? "is-open" : ""}`}>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            className="nav-mobile-toggle"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <Icon name="menu" />
            Menu
          </button>

          <div className="nav-dropdown-panel" id="mobile-navigation">
            <div className="nav-menu">
              <NavLink to="/" end onClick={closeMobileMenu}>
                <Icon name="home" />
                Home
              </NavLink>
              <NavLink to="/recipes" onClick={closeMobileMenu}>
                <Icon name="utensils" />
                Recipes
              </NavLink>
              <NavLink to="/favorites" onClick={closeMobileMenu}>
                <Icon name="heart" />
                Favorites
              </NavLink>
            </div>

            <div className="nav-account">
              {authLoading && <span className="nav-user">Checking session...</span>}

              {!authLoading && user === null && (
                <Link to="/login" className="nav-login" onClick={closeMobileMenu}>
                  <Icon name="logIn" />
                  Login
                </Link>
              )}

              {!authLoading && user !== null && (
                <div className="nav-auth">
                  <span className="nav-user">Hi, {user.firstName}</span>
                  <button
                    className="button button-small button-outline"
                    onClick={handleLogoutClick}
                    type="button"
                  >
                    <Icon name="logOut" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
