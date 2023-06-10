const API_URL = 'http://www.omdbapi.com/'; // API URL for fetching movie data
const API_KEY = 'fc6ae81b'; // API key for accessing the OMDB API


const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const moviesContainer = document.querySelector('#movies');
const movieContainer = document.querySelector('#movie');
const favoritesContainer = document.querySelector('#favorites');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


// Function to fetch and display movies based on search term

function getMovies(searchTerm) {
    fetch(`${API_URL}?apikey=${API_KEY}&s=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                moviesContainer.innerHTML = '';
                data.Search.forEach(movie => {
                    const movieEl = document.createElement('div');
                    movieEl.classList.add('movie');
                    movieEl.innerHTML = `
                        <img src="${movie.Poster}" alt="${movie.Title}">
                        <div class="movie-info">
                            <u><h3>${movie.Title}</h3></u>
                            <p>${movie.Year}</p>
                            <button class="favorite-btn" data-imdbid="${movie.imdbID}">Add to Favorites</button>
                        </div>
                    `;
                    const favoriteBtn = movieEl.querySelector('.favorite-btn');
                    if (favorites.includes(movie.imdbID)) {
                        favoriteBtn.disabled = true;
                    }
                    favoriteBtn.addEventListener('click', () => addToFavorites(movie.imdbID));
                    moviesContainer.appendChild(movieEl);
                });
            } else {
                moviesContainer.innerHTML = '<p>No results found</p>';
            }             
        });
}


// Function to open a new window with the movie details

function getMovie(imdbID) {
    window.open(`details/movie-detail.html?imdbID=${imdbID}`, '_blank');
}


// Function to add a movie to favorites

function addToFavorites(imdbID) {
    favorites.push(imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
        if (btn.dataset.imdbid === imdbID) {
            btn.disabled = true;
        }
    });
    getFavorites();
}


// Function to remove a movie from favorites

function removeFavorite(imdbID) {
    favorites = favorites.filter(id => id !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
        if (btn.dataset.imdbid === imdbID) {
            btn.disabled = false;
        }
    });
    getFavorites();
}


// Function to display favorite movies

function getFavorites() {
    favoritesContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>You have no favorite movies...yet ;)</p>';
    } else {
        favorites.forEach(id => {
            fetch(`${API_URL}?apikey=${API_KEY}&i=${id}`)
                .then(response => response.json())
                .then(movie => {
                    const movieEl = document.createElement('div');
                    movieEl.classList.add('movie');
                    movieEl.innerHTML = `
                        <img src="${movie.Poster}" alt="${movie.Title}">
                        <div class="movie-info">
                            <u><h3>${movie.Title}</h3></u>
                            <p>${movie.Year}</p>
                            <button class="favorite-btn" data-imdbid="${movie.imdbID}">Remove from Favorites</button>
                        </div>
                    `;
                    const favoriteBtn = movieEl.querySelector('.favorite-btn');
                    favoriteBtn.addEventListener('click', () => removeFavorite(movie.imdbID));
                    favoritesContainer.appendChild(movieEl);
                });
        });
    }
}


// Event listener for the search form submission

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    getMovies(searchTerm);
});


// Event listener for the search input change

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        getMovies(searchTerm);
    }
});


// Event listener for the movies container click

moviesContainer.addEventListener('click', e => {
    if (e.target.classList.contains('favorite-btn')) {
        const imdbID = e.target.dataset.imdbid;
    } else {
        const movieElement = e.target.closest('.movie');
        if (movieElement) {
            const imdbID = movieElement.querySelector('.favorite-btn').dataset.imdbid;
            getMovie(imdbID);
        }
    }
});


// Call the function to display favorite movies

getFavorites();

