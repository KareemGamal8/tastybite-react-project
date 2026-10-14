import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const mealType =
    recipe.mealType && recipe.mealType.length > 0 ? recipe.mealType[0] : null;
  const totalTime = recipe.prepTimeMinutes + (recipe.cookTimeMinutes || 0);

  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        <img src={recipe.image} alt={recipe.name} className="recipe-image" />

        <div className="recipe-image-overlay">
          <span className="recipe-badge">
            <Icon name="globe" />
            {recipe.cuisine}
          </span>

          {recipe.difficulty && (
            <span className="recipe-badge recipe-badge-soft">
              <Icon name="chefHat" />
              {recipe.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="recipe-card-body">
        <div className="recipe-card-header">
          <h3 className="recipe-name">{recipe.name}</h3>

          <span className="recipe-rating-pill">
            <Icon name="star" />
            {recipe.rating}
          </span>
        </div>

        {mealType && (
          <p className="recipe-cuisine">
            <Icon name="utensils" />
            {mealType}
          </p>
        )}

        <div className="recipe-meta">
          <span className="recipe-meta-item">
            <Icon name="clock" />
            {totalTime} min
          </span>
          <span className="recipe-meta-item">
            <Icon name="users" />
            {recipe.servings} serve
          </span>
          <span className="recipe-meta-item">
            <Icon name="utensils" />
            {recipe.caloriesPerServing || "--"} cal
          </span>
        </div>

        <div className="recipe-actions">
          <Link
            to={`/recipes/${recipe.id}`}
            className="button button-small recipe-view-button"
          >
            View recipe
            <Icon name="arrowRight" />
          </Link>

          <button
            className={
              isFavorite
                ? "button button-small button-outline favorite-button is-active"
                : "button button-small button-outline favorite-button"
            }
            onClick={function () {
              onToggleFavorite(recipe.id);
            }}
            type="button"
            aria-label={
              isFavorite
                ? `Remove ${recipe.name} from favorites`
                : `Save ${recipe.name} to favorites`
            }
          >
            <Icon name="heart" />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;
