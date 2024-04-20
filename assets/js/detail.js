'use strict';

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sideBar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[pageContent]");
const movieId = window.localStorage.getItem('movieId');

search();
sideBar();


const getGenres = function(genreList){
    let newGenreList = [];
    for(const { name } of genreList) newGenreList.push(name);
    return newGenreList.join(", ");
}

const getCasts = function(castList){
    let newCastList = [];
    for(let i=0, len= castList.length; i < len && i < 10; i++){
        const { name } = castList[i];
        newCastList.push(name)
    }
    return newCastList.join(", ");
}


const getDirector = function(crewList){
    const directors = crewList.filter(({ job }) => job === "Director");
    const directorList = [];
    for(const { name } of directors) directorList.push(name);
    return directorList.join(", ");
}


// Returns only trailers and teasers as an array
const filterVideos = function(videoList){
    return videoList.filter(({ type, site }) => (type === "Trailer" || type === "Teaser") && site === "YouTube");
}

fetchDataFromServer(`https://api.themoviedb.org/3//movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`, function(movie){
    const {
        backdrop_path,
        poster_path,
        title,
        release_date,
        runtime,
        vote_average,
        releases:{ countries: [{ certification }] },
        genres,
        overview,
        casts: { cast, crew },
        videos: { results: videos }
    } = movie

    document.title = `${title} - S&Z Bros`;
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movieDetail");
    movieDetail.innerHTML = `<div
    class="backdropImage"
    style="background-image: url('${imageBaseURL}${"w1280" || "original"}${backdrop_path || poster_path}')"
  ></div>
  <figure class="posterBox moviePoster">
    <img
      src="${imageBaseURL}w342${poster_path}"
      alt="${title}"
      class="imgCover"
    />
  </figure>
  <div class="detailBox">
    <div class="detailContent">
      <h1 class="heading">${title}</h1>
      <div class="metaList">
        <div class="metaItem">
          <img
            src="./assets/images/star.png"
            width="20"
            height="20"
            alt="rating"
          />
          <span class="span">${vote_average.toFixed(1)}</span>
        </div>
        <div class="separator"></div>
        <div class="metaItem">${runtime}m</div>
        <div class="separator"></div>
        <div class="metaItem">${release_date.split("-")[0]}</div>
        <div class="metaItem cardBadge">${certification}</div>
      </div>

      <p class="genre">${getGenres(genres)}</p>
      <p class="overview">${overview}</p>
      <ul class="detailList">
        <div class="listItem">
          <p class="listName">Staring</p>
          <p>${getCasts(cast)}</p>
        </div>

        <div class="listItem">
          <p class="listName">Directed By</p>
          <p>${getDirector(crew)}</p>
        </div>
      </ul>
    </div>

    <div class="titleWrapper">
      <h3 class="titleLarge">Trailers and Clips</h3>
    </div>

    <div class="sliderList">
      <div class="sliderInner">
        
      </div>
    </div>
  </div>`;


  for (const { key, name } of filterVideos(videos)){
    const videoCard = document.createElement("div");
    videoCard.classList.add("videoCard");

    videoCard.innerHTML = `<iframe src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" width="500" height="294" allowfullscreen="1" title="${name}" class="imgCover" loading="lazy"></iframe>`;

    movieDetail.querySelector(".sliderInner").appendChild(videoCard);
  }

  pageContent.appendChild(movieDetail);

  fetchDataFromServer(`https://api.themoviedb.org/3//movie/${movieId}/recommendations?api_key=${api_key}&page=1`, addSuggestedMovies)
});


const addSuggestedMovies = function ({ results: movieList }, title) {
  
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("moviesList");
    movieListElem.ariaLabel = "You May Also Like";
    movieListElem.innerHTML = `<div class="titleWrapper">
      <h3 class="titleLarge">You May Also Like</h3>
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