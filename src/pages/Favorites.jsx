import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

function Favorites({ favoriteIds, onToggleFavorite }) {
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      try {
        const response = await fetch("https://dummyjson.com/recipes?limit=50");

        if (!response.ok) {
          throw new Error("Could not load your favorite recipes.");
        }

        const data = await response.json();
        setAllRecipes(data.recipes);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }

    loadRecipes();
  }, []);

  // Keep only the recipes whose ID is in the favorites list.
  // This runs on every render, so removing a favorite updates the page right away.
  const favoriteRecipes = allRecipes.filter(function (recipe) {
    return favoriteIds.includes(recipe.id);
  });

  if (loading) {
    return (
      <div className="container section">
        <Helmet>
          <title>My Favorites | TastyBite</title>
        </Helmet>
        <Loading text="Loading favorites..." />
      </div>
    );
  }

  if (error !== "") {
    return (
      <div className="container section">
        <Helmet>
          <title>My Favorites | TastyBite</title>
        </Helmet>
        <p className="message message-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <Helmet>
        <title>My Favorites | TastyBite</title>
        <meta
          name="description"
          content="View the recipes you saved as favorites on TastyBite."
        />
      </Helmet>

      <h1 className="page-title">My Favorites</h1>

      {favoriteRecipes.length === 0 && (
        <div className="empty-state">
          <p>You have no favorite recipes yet.</p>
          <Link to="/recipes" className="button">
            Find recipes
          </Link>
        </div>
      )}

      <div className="recipe-grid">
        {favoriteRecipes.map(function (recipe) {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Favorites;
