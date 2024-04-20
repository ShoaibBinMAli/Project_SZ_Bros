'use strict';

import { imageBaseURL } from "./api.js";

export function createMovieCard(movie) {
    const {
        poster_path,
        title,
        vote_average,
        release_date,
        id
    } = movie;

    const card = document.createElement("div");
    card.classList.add("movieCard");
    card.innerHTML = ` <figure class="posterBox cardBanner">
    <img
      src="${imageBaseURL}w342${poster_path}"
      alt="${title}"
      class="imgCover"
      loading="lazy"
    />
  </figure>
  <h4 class="title">${title}</h4>
  <div class="metaList">
    <div class="metaItem">
      <img
        src="./assets/images/star.png"
        width="20"
        height="20"
        loading="lazy"
        alt="rating"
      />
      <span class="span">${vote_average.toFixed(1)}</span>
    </div>
    <div class="cardBadge">${release_date.split("-")[0]}</div>
  </div>

  <a
    href="./detail.html"
    class="cardBtn"
    title="${title}"
    onclick="getMovieDetail(${id})"
  ></a>`;

  return card;
}
