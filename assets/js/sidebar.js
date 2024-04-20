'use strict';

import { api_key, fetchDataFromServer } from "./api.js";



export function sideBar(){
    const genreList = {};
    fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function({genres}){
        for(const {id, name} of genres){
            genreList[id] = name;
        }
        genreLink();
    });
    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebarInner");
    sidebarInner.innerHTML = `<div class="sidebarList" sidebarList>
    <p class="title">Genre</p>
  </div>
  <div class="sidebarList">
    <p class="title">Language</p>
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=en", "English")' menuClose class="siedeBarLinks"
      >English</a
    >
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=hi", "Hindi")' menuClose class="siedeBarLinks"
      >Hindi</a
    >
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=pa", "Punjabi")' menuClose class="siedeBarLinks"
      >Punjabi</a
    >
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=bn", "Bengali")' menuClose class="siedeBarLinks"
      >Bengali</a
    >
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=ur", "Urdu")' menuClose class="siedeBarLinks"
      >Urdu</a
    >
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=tr", "Turkish")' menuClose class="siedeBarLinks"
      >Turkish</a
    >
    <a href="./movie-list.html" menuClose class="siedeBarLinks"
      >Chinies</a
    >
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=ar", "Arabic")' menuClose class="siedeBarLinks"
      >Arabic</a
    >
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=de", "German")' menuClose class="siedeBarLinks"
      >German</a
    >
    <a href="./movie-list.html" onclick='getMovieList("with_original_language=es", "Spanish")' menuClose class="siedeBarLinks"
      >Spanish</a
    >
  </div>
  <div class="sideBarFooter">
    <p class="copyright">Copyright 2024 <a href="#">S&Z Bros</a></p>
    <img
      src="./assets/images/tmdb-logo.svg"
      width="130"
      height="17"
      alt="the movie database logo"
    />
  </div>`;

  const genreLink = function(){
    for(const [genreId, genreName] of Object.entries(genreList)){
        const link = document.createElement("a");
        link.classList.add("siedeBarLinks");
        link.setAttribute("href", "./movie-list.html");
        link.setAttribute("menuClose", "");
        link.setAttribute("onClick", `getMovieList("with_genres=${genreId}", "${genreName}")`);
        link.textContent = genreName;
        sidebarInner.querySelector(".sidebarList").appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  }

  const toggleSidebar = function(sidebar){
    // toggle sidebar in mobile screen
    const sidebarBtn = document.querySelector("[menuBtn]");
    const menuCloseBtn = document.getElementById("menuCloseBtn");
    const sidebarTogglers = document.querySelector("[menuToggler]");
    const sidebarClose = document.querySelectorAll("[menuClose]");
    const overlay = document.querySelector("[overlay]");

    addEventOnElement(sidebarBtn, "click", function(){
        sidebar.classList.toggle("active")
        sidebarBtn.classList.toggle("active")
        overlay.classList.toggle("active")
    });

    addEventOnElement(sidebarClose, "click", function(){
        sidebar.classList.remove("active")
        sidebarBtn.classList.remove("active")
        overlay.classList.remove("active")
    });
  }
}