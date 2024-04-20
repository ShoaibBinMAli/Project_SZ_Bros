"use strict";
// import all components and functions

import { sideBar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[pageContent]");

search();
sideBar();

// Home page sections (top rated, Upcoming, trending)
const homePageSections = [
  {
    title: "Now Playing",
    path: "/movie/upcoming",
  },
  {
    title: "Upcoming",
    path: "/movie/upcoming",
  },
  {
    title: "Popular",
    path: "/trending/movie/week",
  },
  {
    title: "Top Rated",
    path: "/movie/top_rated",
  },
];

const genreList = {
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }
    return newGenreList.join(", ");
  },
};

// Fetch genre list and popular movies for hero banner
fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
      heroBanner
    );
  }
);

// Hero banner function
const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.setAttribute("aria-label", "Popular Movies");

  const bannerSlider = document.createElement("div");
  bannerSlider.classList.add("bannerSlider");

  const sliderControlContainer = document.createElement("div");
  sliderControlContainer.classList.add("sliderControl");
  const controlInner = document.createElement("div");
  controlInner.classList.add("controlInner");
  sliderControlContainer.appendChild(controlInner);

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("sliderItem");
    sliderItem.setAttribute("sliderItem", "");

    sliderItem.innerHTML = `<img
                src="${imageBaseURL}w1280${backdrop_path}"
                alt="${title}" 
                class="imgCover"
                loading=${index === 0 ? "eager" : "lazy"}
            />
            <div class="bannerContent">
                <h2 class="heading">${title}</h2>
                <div class="metaList">
                    <div class="metaItem">${release_date.split("-")[0]}</div>
                    <div class="metaItem cardBadge">${vote_average.toFixed(
                      1
                    )}</div>
                </div>
                <p class="genre">${genreList.asString(genre_ids)}</p>
                <p class="bannerText">${overview}</p>
                <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
                    <img
                        src="./assets/images/play_circle.png"
                        width="24"
                        height="24"
                        aria-hidden="true"
                        alt="play circle"
                    />
                    <span class="span">Watch Now</span>
                </a>
            </div>`;

    bannerSlider.appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("posterBox", "sliderItem");
    controlItem.setAttribute("sliderControl", `${index}`);
    controlItem.innerHTML = `<img src="${imageBaseURL}w154${poster_path}" loading="lazy" class="imgCover" draggable="false" alt="Slide to ${title}">`;
    controlInner.appendChild(controlItem);
  }

  banner.appendChild(bannerSlider);
  banner.appendChild(sliderControlContainer);
  pageContent.appendChild(banner);

  // Fetch data for home page sections (top rated, upcoming, trending)
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?&page=1&api_key=${api_key}`,
      function(data) {
        createMovieList(data, title);
      }
    );
  }

  addHeroSlide();
};

// Function to add hero slide
function addHeroSlide() {
  const controlButtons = document.querySelectorAll(".controlInner .posterBox");
  const sliderItems = document.querySelectorAll(".bannerSlider .sliderItem");
  let currentIndex = 0;

  const changeSlide = (index) => {
    sliderItems.forEach((item) => item.classList.remove("active"));
    controlButtons.forEach((item) => item.classList.remove("active"));
    sliderItems[index].classList.add("active");
    controlButtons[index].classList.add("active");
  };
  controlButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      changeSlide(index);
      currentIndex = index;
    });
  });
  changeSlide(currentIndex);
  setInterval(() => {
    currentIndex = (currentIndex + 1) % sliderItems.length;
    changeSlide(currentIndex);
  }, 5000);
}

// Function to create movie list
const createMovieList = function (data, title) {
  const { results: movieList } = data;

  const movieListElem = document.createElement("section");
  movieListElem.classList.add("moviesList");
  movieListElem.ariaLabel = `${title}`;
  movieListElem.innerHTML = `<div class="titleWrapper">
    <h3 class="titleLarge">${title}</h3>
  </div>
  <div class="sliderList">
    <div class="sliderInner">
    </div>
  </div>`;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);

    movieListElem.querySelector(".sliderInner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};