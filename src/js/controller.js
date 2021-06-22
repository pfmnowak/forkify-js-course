import 'core-js/stable'; // Polyfilling everything
import 'regenerator-runtime/runtime'; // Polyfilling async
import { MODAL_CLOSE_SEC } from './config';
const { before } = require('lodash');

import * as model from './model';
import addRecipeView from './views/addRecipeView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView';
import searchView from './views/searchView';

if (module.hot) {
	module.hot.accept();
}

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();

		// 0) Update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage());

		// 2) Updating bookmarks view
		bookmarksView.update(model.state.bookmarks);

		// 2) Loading recipe
		await model.loadRecipe(id);

		// 3) Rendering recipe
		recipeView.render(model.state.recipe);
	} catch (err) {
		console.error(`${err} 💣💥💥💥👌`);
		// recipeView.renderError(`${err} 💣💥💥💥👌`);
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();

		// 1) Get search query
		const query = searchView.getQuery();
		if (!query) return;

		// 2) Load search results
		await model.loadSearchResults(query);

		// 3) Render results
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		// 4) Render initial pagination buttons
		paginationView.render(model.state.search);

		//
	} catch (err) {
		console.error(err);
	}
};

const controlPagination = function (goToPage) {
	// 1) Render NEW results
	resultsView.render(model.getSearchResultsPage(goToPage));

	// 2) Render NEW pagination buttons
	paginationView.render(model.state.search);
};

const controlSettings = function (newServings) {
	// Update the recipe servings (in state)
	model.updateServings(newServings);

	// Update the recipe view
	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// 1) Add/remove bookmark
	if (model.state.recipe.bookmarked)
		model.deleteBookmark(model.state.recipe.id);
	else model.addBookmark(model.state.recipe);

	// 2) Update recipe view
	recipeView.update(model.state.recipe);

	// 3) Render bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		// Show loading spinner
		addRecipeView.renderSpinner();

		// Upload the new recipe data
		await model.uploadRecipe(newRecipe);

		// Render recipe
		recipeView.render(model.state.recipe);

		// Success Message
		addRecipeView.renderMessage();

		// Change ID in URL
		window.history.pushState(null, '', `#${model.state.recipe.id}`);

		// Render bookmark view
		bookmarksView.render(model.state.bookmarks);

		// Close form window
		setTimeout(function () {
			addRecipeView.toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		console.log('💣💥', err);
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	addRecipeView.addHandlerUpload(controlAddRecipe);
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlSettings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
};

init();
