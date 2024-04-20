"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { sideBar } from "./sidebar.js";
import { search } from "./search.js";


search();
sideBar();

let currentPage = 1;
let totalPages = 0;

// collect genre name & url parameter from local storage
const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");
const pageContent = document.querySelector("[pageContent]");

fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`, function ({ results: movieList, total_pages }) {
    totalPages = total_pages;
    document.title = `${genreName} Movies - S&Z Bros`;

    const movieListElem = document.createElement("section");
    movieListElem.classList.add("moviesList", "genreList");

    movieListElem.ariaLabel = `${genreName} Movies`;
    movieListElem.innerHTML = `<div class="titleWrapper">
    <h1 class="heading">All ${genreName}</h1>
  </div>
  <div class="gridList" id="gridListItem"></div>

  <button class="btn loadMore loading" id="loadMore">Load More</button>`;

    // add movies card based on fetched itmes

    for (const movie of movieList) {
        const movieCard = createMovieCard(movie);
        movieListElem.querySelector(".gridList").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);
    console.log(movieList);

    //   load more button functionality
    document.getElementById("loadMore").addEventListener("click", function () {
        if (currentPage >= totalPages) {
            this.style.display = "none"; // this == loadMore
            return;
        }

        currentPage++;
        this.classList.add("loading");

        fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`, ({ results: movieList }) => {
            this.classList.remove("loading");

            for (const movie of movieList) {
                const movieCard = createMovieCard(movie);

                movieListElem.querySelector("#gridListItem").appendChild(movieCard);
            }
        });
    });
});