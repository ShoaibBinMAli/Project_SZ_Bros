'use strict';

// Add event on a single element
const addEventOnElement = function (element, eventType, callback){
    element.addEventListener(eventType, callback);
}

// Toggle Search Box in Mobile devices || Small screens
const searchBox = document.getElementById("searchBox");
const searchToggler = document.getElementById("searchToggler");
const searchClose = document.getElementById("searchClose");

searchToggler.addEventListener('click', () => {
    console.log("clicked")
    searchBox.classList.toggle("active");
});
searchClose.addEventListener('click', () => {
    searchBox.classList.remove("active");
})


// store movieId in localStorage when click on movie card

const getMovieDetail = function(movieId){
    window.localStorage.setItem("movieId", String(movieId));
}


const getMovieList = function(urlParam, genreName){
    window.localStorage.setItem("urlParam", urlParam)
    window.localStorage.setItem("genreName", genreName)
}