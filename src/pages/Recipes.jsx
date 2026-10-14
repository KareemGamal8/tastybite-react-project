import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Icon from "../components/Icon.jsx";
import Loading from "../components/Loading.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

const RECIPES_PER_PAGE = 10;

function Recipes({ favoriteIds, onToggleFavorite }) {
  // Data from the API
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search, filter, sort, and page
  const [searchText, setSearchText] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const response = await fetch("https://dummyjson.com/recipes?limit=50");

        if (!response.ok) {
          throw new Error("Could not load recipes. Please try again.");
        }

        const data = await response.json();
        setRecipes(data.recipes);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }

    loadRecipes();
  }, []);

  // ----- Build the dropdown options from the data -----
  const cuisines = [];
  const mealTypes = [];

  recipes.forEach(function (recipe) {
    if (!cuisines.includes(recipe.cuisine)) {
      cuisines.push(recipe.cuisine);
    }

    recipe.mealType.forEach(function (type) {
      if (!mealTypes.includes(type)) {
        mealTypes.push(type);
      }
    });
  });

  cuisines.sort();
  mealTypes.sort();

  // ----- Step 1: search + filters -----
  const filteredRecipes = recipes.filter(function (recipe) {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "all" || recipe.cuisine === selectedCuisine;

    const matchesMealType =
      selectedMealType === "all" || recipe.mealType.includes(selectedMealType);

    return matchesSearch && matchesCuisine && matchesMealType;
  });

  // ----- Step 2: sorting (copy the array first so we don't change the original) -----
  const sortedRecipes = [...filteredRecipes];

  sortedRecipes.sort(function (a, b) {
    if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === "rating-desc") {
      return b.rating - a.rating;
    }
    return a.rating - b.rating;
  });

  // ----- Step 3: pagination -----
  const totalPages = Math.ceil(sortedRecipes.length / RECIPES_PER_PAGE);
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const endIndex = startIndex + RECIPES_PER_PAGE;
  const recipesOnThisPage = sortedRecipes.slice(startIndex, endIndex);

  const pageNumbers = [];
  for (let page = 1; page <= totalPages; page++) {
    pageNumbers.push(page);
  }

  const hasActiveFilters =
    searchText !== "" ||
    selectedCuisine !== "all" ||
    selectedMealType !== "all" ||
    sortBy !== "name-asc";

  // ----- Event handlers -----
  // Every time search/filter/sort changes, go back to page 1.
  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setCurrentPage(1);
  }

  function handleCuisineChange(event) {
    setSelectedCuisine(event.target.value);
    setCurrentPage(1);
  }

  function handleMealTypeChange(event) {
    setSelectedMealType(event.target.value);
    setCurrentPage(1);
  }

  function handleSortChange(event) {
    setSortBy(event.target.value);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  }

  function clearFilters() {
    setSearchText("");
    setSelectedCuisine("all");
    setSelectedMealType("all");
    setSortBy("name-asc");
    setCurrentPage(1);
  }

  // ----- What to show -----
  if (loading) {
    return (
      <div className="container section">
        <Helmet>
          <title>Recipes | TastyBite</title>
        </Helmet>
        <Loading text="Loading recipes..." />
      </div>
    );
  }

  if (error !== "") {
    return (
      <div className="container section">
        <Helmet>
          <title>Recipes | TastyBite</title>
        </Helmet>
        <p className="message message-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container section">
      <Helmet>
        <title>Recipes | TastyBite</title>
        <meta
          name="description"
          content="Search, filter, and sort TastyBite recipes by cuisine, meal type, name, and rating."
        />
      </Helmet>

      <h1 className="page-title">Recipes</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search recipes by name"
          value={searchText}
          onChange={handleSearchChange}
        />

        <select value={selectedCuisine} onChange={handleCuisineChange}>
          <option value="all">All cuisines</option>
          {cuisines.map(function (cuisine) {
            return (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            );
          })}
        </select>

        <select value={selectedMealType} onChange={handleMealTypeChange}>
          <option value="all">All meal types</option>
          {mealTypes.map(function (type) {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </select>

        <select value={sortBy} onChange={handleSortChange}>
          <option value="name-asc">Name (A to Z)</option>
          <option value="name-desc">Name (Z to A)</option>
          <option value="rating-desc">Rating (high to low)</option>
          <option value="rating-asc">Rating (low to high)</option>
        </select>
      </div>

      <div className="results">
        <p className="results-count">
          {sortedRecipes.length}{" "}
          {sortedRecipes.length === 1 ? "recipe" : "recipes"} found
        </p>

        <div className="filters-summary">
          <button
            className="button button-small button-outline reset-filters-button"
            disabled={!hasActiveFilters}
            onClick={clearFilters}
            type="button"
          >
            <Icon name="rotateCcw" />
            Reset filters
          </button>
        </div>
      </div>

      {sortedRecipes.length === 0 && (
        <div className="empty-state">
          <p>No recipes match your search. Try a different name or filter.</p>
          <button className="button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}

      <div className="recipe-grid">
        {recipesOnThisPage.map(function (recipe) {
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="button button-small button-outline"
            disabled={currentPage === 1}
            onClick={function () {
              handlePageChange(currentPage - 1);
            }}
          >
            Previous
          </button>

          {pageNumbers.map(function (page) {
            return (
              <button
                key={page}
                className={
                  page === currentPage
                    ? "button button-small"
                    : "button button-small button-outline"
                }
                onClick={function () {
                  handlePageChange(page);
                }}
              >
                {page}
              </button>
            );
          })}

          <button
            className="button button-small button-outline"
            disabled={currentPage === totalPages}
            onClick={function () {
              handlePageChange(currentPage + 1);
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Recipes;
