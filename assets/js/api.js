'use strict';

const api_key = 'b4a343bb07db6abb3a093d611bf42d7c';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

// fetch data from a server using the url and passes the result in JSON data to a 'callback' function, 
// along with an optional paramenter if has 'optionalParam'.

const fetchDataFromServer = function(url, callback, optionalParam){
    fetch(url).then(response => response.json()).then(data => callback(data, optionalParam));
}

export {
    imageBaseURL,
    api_key,
    fetchDataFromServer
};