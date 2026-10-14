import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Recipes from "./pages/Recipes.jsx";
import RecipeDetails from "./pages/RecipeDetails.jsx";
import Login from "./pages/Login.jsx";
import Favorites from "./pages/Favorites.jsx";

// Read the saved favorite recipe IDs from localStorage.
function getSavedFavorites() {
  const savedText = localStorage.getItem("favoriteIds");

  if (savedText === null) {
    return [];
  }

  try {
    return JSON.parse(savedText);
  } catch (error) {
    return [];
  }
}

function App() {
  // The logged-in user (null means nobody is logged in)
  const [user, setUser] = useState(null);

  // true while we are checking the saved token when the app starts
  const [authLoading, setAuthLoading] = useState(true);

  // A list of recipe IDs, for example [1, 5, 12]
  const [favoriteIds, setFavoriteIds] = useState(getSavedFavorites);

  // When the app starts, check if there is a saved token.
  useEffect(() => {
    async function loadAuthUser() {
      const token = localStorage.getItem("accessToken");

      if (token === null) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch("https://dummyjson.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // The session is invalid or expired, so clear it.
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setUser(null);
        }
      } catch (error) {
        // Network problem. We keep the token and just show logged-out UI.
        setUser(null);
      }

      setAuthLoading(false);
    }

    loadAuthUser();
  }, []);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  function toggleFavorite(recipeId) {
    let newFavoriteIds;

    if (favoriteIds.includes(recipeId)) {
      newFavoriteIds = favoriteIds.filter(function (id) {
        return id !== recipeId;
      });
    } else {
      newFavoriteIds = [...favoriteIds, recipeId];
    }

    setFavoriteIds(newFavoriteIds);
    localStorage.setItem("favoriteIds", JSON.stringify(newFavoriteIds));
  }

  return (
    <div className="app">
      <Navbar user={user} authLoading={authLoading} onLogout={handleLogout} />

      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/recipes"
            element={
              <Recipes
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/recipes/:recipeId"
            element={
              <RecipeDetails
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute user={user} authLoading={authLoading}>
                <Favorites
                  favoriteIds={favoriteIds}
                  onToggleFavorite={toggleFavorite}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
