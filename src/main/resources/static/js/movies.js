document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '998d343674fbacfea441d0e40df4f0ea';
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Elementos del modal
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.body.appendChild(overlay);

    const closeModalButton = document.createElement('button');
    closeModalButton.textContent = 'Cerrar';
    closeModalButton.classList.add('close-modal');
    modalContent.appendChild(closeModalButton);

    // Elementos dentro del modal
    const modalPoster = document.createElement('img');
    const modalDetails = document.createElement('div');
    modalDetails.classList.add('modal-details');
    const modalTitle = document.createElement('h2');
    const modalReleaseDate = document.createElement('p');
    const modalRating = document.createElement('p');
    const modalDescription = document.createElement('p');
    const modalGenres = document.createElement('p');
    const modalDirector = document.createElement('p');
    const modalActors = document.createElement('p');
    const modalLink = document.createElement('a');
    const modalTrailerLink = document.createElement('a');

    modalLink.textContent = 'Ver más en TMDB';
    modalLink.target = '_blank';

    modalTrailerLink.textContent = 'Ver tráiler';
    modalTrailerLink.target = '_blank';
    modalTrailerLink.style.display = 'none';

    // Agregar imagen y detalles al modal
    modalContent.append(modalPoster, modalDetails);
    modalDetails.append(modalTitle, modalReleaseDate, modalRating, modalDescription, modalGenres, modalDirector, modalActors, modalLink, modalTrailerLink);

    let currentMovie = null;

    // Evento de búsqueda
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const movies = await searchMovies(query);
            displayMovies(movies);
        }
    });

    async function searchMovies(query) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error al obtener datos:', error);
            return [];
        }
    }

    function displayMovies(movies) {
        resultsDiv.innerHTML = '';

        if (movies.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontraron películas.</p>';
            return;
        }

        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            const movieTitle = document.createElement('h3');
            movieTitle.textContent = `${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})`;

            const movieImg = document.createElement('img');
            movieImg.src = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "../assets/imgs/posterNotFound.jpg";
            movieImg.alt = movie.title;

            movieDiv.addEventListener('click', () => showMovieDetails(movie));

            movieDiv.append(movieImg, movieTitle);
            resultsDiv.appendChild(movieDiv);
        });
    }

    async function showMovieDetails(movie) {
        currentMovie = movie;
        modalPoster.src = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "../assets/imgs/posterNotFound.jpg";
        modalTitle.textContent = movie.title;
        modalReleaseDate.innerHTML = `<strong>Fecha de estreno:</strong> ${movie.release_date || 'Desconocida'}`;

        // Calificación con color o mensaje alternativo
        if (movie.vote_average) {
            modalRating.innerHTML = `<strong>Calificación:</strong> <span style="font-weight: bold; color: ${getRatingColor(movie.vote_average)}">${movie.vote_average.toFixed(1)}</span>`;
        } else {
            modalRating.innerHTML = `<strong>Calificación:</strong> No disponible`;
        }

        modalDescription.textContent = movie.overview || 'Sin descripción disponible.';

        const genres = await getMovieGenres(movie.genre_ids);
        modalGenres.innerHTML = `<strong>Géneros:</strong> ${genres.length ? genres.join(', ') : 'No disponible'}`;

        modalLink.href = `https://www.themoviedb.org/movie/${movie.id}`;

        // Obtener detalles de la película (director y actores)
        const { director, actors } = await getMovieCredits(movie.id);
        modalDirector.innerHTML = `<strong>Director:</strong> ${director || 'Desconocido'}`;
        modalActors.innerHTML = `<strong>Actores principales:</strong> ${actors.length ? actors.join(', ') : 'No disponible'}`;

        // Obtener tráiler
        const trailerUrl = await getTrailer(movie.id);
        if (trailerUrl) {
            modalTrailerLink.href = trailerUrl;
            modalTrailerLink.style.display = 'inline-block';
        } else {
            modalTrailerLink.style.display = 'none';
        }

        // Mostrar el modal con transición suave
        overlay.classList.add('show');
        modal.classList.add('open');
    }

    async function getMovieGenres(genreIds) {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.genres.filter(genre => genreIds.includes(genre.id)).map(genre => genre.name);
        } catch (error) {
            console.error('Error al obtener los géneros:', error);
            return [];
        }
    }

    async function getMovieCredits(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const director = data.crew.find(person => person.job === 'Director')?.name || null;
            const actors = data.cast.slice(0, 5).map(actor => actor.name);
            return { director, actors };
        } catch (error) {
            console.error('Error al obtener créditos:', error);
            return { director: null, actors: [] };
        }
    }

    async function getTrailer(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const trailer = data.results.find(video => video.type === 'Trailer');
            return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
        } catch (error) {
            console.error('Error al obtener el tráiler:', error);
            return null;
        }
    }

    function getRatingColor(rating) {
        return rating <= 3 ? 'red' : rating <= 5 ? 'orange' : rating <= 8 ? 'yellow' : 'green';
    }

    overlay.addEventListener('click', closeModal);
    closeModalButton.addEventListener('click', closeModal);

    function closeModal() {
        modal.classList.remove('open');
        overlay.classList.remove('show');
    }
});
