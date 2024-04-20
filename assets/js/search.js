"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector("#searchWrapper");
  const searchField = document.querySelector("#searchField");

  const searchResultModel = document.createElement("div");
  searchResultModel.classList.add("searchModel");
  document.querySelector("main").appendChild(searchResultModel);

  let searchTimeOut;
  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchResultModel.classList.remove("searchModelActive");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeOut);
      return;
    }
    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeOut);

    searchTimeOut = setTimeout(function () {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`,
        function ({ results: movieList }) {
          searchWrapper.classList.remove("searching");
          searchResultModel.classList.add("searchModelActive");
          // searchResultModel.innerHTML = ""; // remove old results
          searchResultModel.innerHTML = `<p class="label">Results for</p>
          <h1 class="heading">${searchField.value}</h1>
          <div class="movieList">
              <div class="gridList" id="gridListContent"></div>
          </div>`;

          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);
            searchResultModel.querySelector("#gridListContent").appendChild(movieCard);
          }
        }
      );
    }, 500);
  });
}
