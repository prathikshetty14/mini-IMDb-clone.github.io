// movie-details.html

const API_URL = 'http://www.omdbapi.com/';
const API_KEY = 'fc6ae81b';

const movieContainer = document.querySelector('#movie');


// Get the IMDB ID from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('imdbID');


// Fetch movie details using the IMDB ID
fetch(`${API_URL}?apikey=${API_KEY}&i=${imdbID}`)
  .then(response => response.json())
  .then(movie => {
    const movieEl = document.createElement('div');
    movieEl.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}">
      <span id="movie-info">
      <h1>${movie.Title}</h1>
      <span id="imp-details">
      <p><b>Runtime</b>: ${movie.Runtime}</p>
      <p><b>Director</b>: ${movie.Director}</p>
      <p>Release Date: ${movie.Released}</p>
      </span>
      <p class="rating"><b>IMDb Rating</b>: ${movie.imdbRating}</p>
      <p>${movie.Plot}</p>
      <p><b>Genre</b>: ${movie.Genre}</p>
      <p><b>Actors</b>: ${movie.Actors}</p>
      <p class="yellow"><i>Language: ${movie.Language}</i></p>
      <p><i class="fa fa-trophy yellow"></i> &nbsp &nbsp${movie.Awards}</p>
      </span>
    `;
    movieContainer.appendChild(movieEl);
  });
