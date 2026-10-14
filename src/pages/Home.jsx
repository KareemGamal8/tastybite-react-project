import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

function Home({ favoriteIds, onToggleFavorite }) {
  const navigate = useNavigate();

  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeaturedRecipes() {
      try {
        const response = await fetch(
          "https://dummyjson.com/recipes?limit=4&sortBy=rating&order=desc"
        );

        if (!response.ok) {
          throw new Error("Could not load featured recipes.");
        }

        const data = await response.json();
        setFeaturedRecipes(data.recipes);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }

    loadFeaturedRecipes();
  }, []);

  return (
    <div>
      <Helmet>
        <title>TastyBite | Recipe Finder</title>
        <meta
          name="description"
          content="Browse simple, tasty recipes from around the world and save your favorites."
        />
      </Helmet>

      <section className="hero">
        <div className="container">
          <h1>Find your next favorite meal</h1>
          <p>
            Browse simple, tasty recipes from around the world. Search by
            cuisine, save the ones you love, and start cooking.
          </p>
          <button
            className="button"
            onClick={function () {
              navigate("/recipes");
            }}
          >
            Browse Recipes
          </button>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">Featured recipes</h2>

        {loading && <Loading text="Loading featured recipes..." />}
        {error !== "" && <p className="message message-error">{error}</p>}

        <div className="recipe-grid">
          {featuredRecipes.map(function (recipe) {
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favoriteIds.includes(recipe.id)}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
