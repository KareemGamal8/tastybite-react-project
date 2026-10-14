import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import Loading from "../components/Loading.jsx";

function RecipeDetails({ favoriteIds, onToggleFavorite }) {
  const { recipeId } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`https://dummyjson.com/recipes/${recipeId}`);

        if (!response.ok) {
          throw new Error("We could not find this recipe.");
        }

        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }

    loadRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <div className="container section">
        <Helmet>
          <title>Loading Recipe | TastyBite</title>
        </Helmet>
        <Loading text="Loading recipe..." />
      </div>
    );
  }

  if (error !== "") {
    return (
      <div className="container section">
        <Helmet>
          <title>Recipe Not Found | TastyBite</title>
        </Helmet>
        <p className="message message-error">{error}</p>
        <Link to="/recipes" className="button">
          Back to Recipes
        </Link>
      </div>
    );
  }

  const isFavorite = favoriteIds.includes(recipe.id);

  return (
    <div className="container section">
      <Helmet>
        <title>{recipe.name} | TastyBite</title>
        <meta
          name="description"
          content={`Make ${recipe.name}, a ${recipe.cuisine} recipe rated ${recipe.rating} stars.`}
        />
      </Helmet>

      <div className="details">
        <img src={recipe.image} alt={recipe.name} className="details-image" />

        <div className="details-info">
          <h1>{recipe.name}</h1>

          <p className="details-line">
            <span className="star">★</span> {recipe.rating} ({recipe.reviewCount} reviews)
            &nbsp;|&nbsp; {recipe.cuisine}
          </p>

          <ul className="details-stats">
            <li>
              <strong>{recipe.prepTimeMinutes} min</strong>
              <span>Prep time</span>
            </li>
            <li>
              <strong>{recipe.cookTimeMinutes} min</strong>
              <span>Cook time</span>
            </li>
            <li>
              <strong>{recipe.servings}</strong>
              <span>Servings</span>
            </li>
          </ul>

          <div className="details-buttons">
            <Link to="/recipes" className="button button-outline">
              Back to Recipes
            </Link>

            <button
              className="button"
              onClick={function () {
                onToggleFavorite(recipe.id);
              }}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>

      <div className="details-columns">
        <section className="details-box">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map(function (ingredient, index) {
              return <li key={index}>{ingredient}</li>;
            })}
          </ul>
        </section>

        <section className="details-box">
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map(function (step, index) {
              return <li key={index}>{step}</li>;
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default RecipeDetails;
