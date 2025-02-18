document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Elementos de modal y overlay
    const modal = document.createElement('div');
    const overlay = document.createElement('div'); // Fondo oscuro
    const modalContent = document.createElement('div');
    modal.appendChild(modalContent);
    modal.classList.add('modal');
    document.body.appendChild(modal);
    document.body.appendChild(overlay); // Añadir el overlay

    overlay.classList.add('modal-overlay'); // Aplicar la clase de estilo para el overlay

    const closeModalButton = document.createElement('button');
    closeModalButton.textContent = 'Cerrar';
    closeModalButton.classList.add('close-modal');
    modalContent.appendChild(closeModalButton);

    // Otros elementos del modal (poster, título, descripción, etc.)
    const modalPoster = document.createElement('img');
    modalContent.appendChild(modalPoster);
    const modalTitle = document.createElement('h2');
    modalContent.appendChild(modalTitle);
    const modalReleaseDate = document.createElement('p');
    modalContent.appendChild(modalReleaseDate);
    const modalRating = document.createElement('p');
    modalContent.appendChild(modalRating);
    const modalDescription = document.createElement('p');
    modalContent.appendChild(modalDescription);
    const modalGenres = document.createElement('p');
    modalContent.appendChild(modalGenres);
    const modalLink = document.createElement('a');
    modalLink.textContent = 'Ver más en TMDB';
    modalLink.target = '_blank';
    modalContent.appendChild(modalLink);

    const modalButtons = document.createElement('div');
    modalContent.appendChild(modalButtons);

    const saveForLaterButton = document.createElement('button');
    saveForLaterButton.textContent = 'Guardar como por ver';
    const saveWatchedButton = document.createElement('button');
    saveWatchedButton.textContent = 'Guardar como vista';
    modalButtons.appendChild(saveForLaterButton);
    modalButtons.appendChild(saveWatchedButton);

    let currentMovie = null;

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const movies = await searchMovies(query);
            displayMovies(movies);
        }
    });

    async function searchMovies(query) {
        const apiKey = '998d343674fbacfea441d0e40df4f0ea';
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
            movieTitle.textContent = movie.title + ' (' + movie.release_date.substring(0, 4) + ')';

            const movieImg = document.createElement('img');
            movieImg.src = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
            movieImg.alt = movie.title;

            movieDiv.addEventListener('click', () => showMovieDetails(movie));

            movieDiv.appendChild(movieImg);
            movieDiv.appendChild(movieTitle);
            resultsDiv.appendChild(movieDiv);
        });
    }

    async function showMovieDetails(movie) {
        currentMovie = movie;
        modalPoster.src = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
        modalTitle.textContent = movie.title;
        modalReleaseDate.textContent = `Fecha de estreno: ${movie.release_date}`;
        modalRating.textContent = `Calificación: ${movie.vote_average}`;
        modalDescription.textContent = movie.overview || 'Sin descripción disponible.';

        const genres = await getMovieGenres(movie.genre_ids);
        modalGenres.textContent = `Géneros: ${genres.join(', ')}`;

        modalLink.href = `https://www.themoviedb.org/movie/${movie.id}`;

        // Mostrar overlay y ventana modal con efecto smooth
        overlay.classList.add('show');
        modal.classList.add('open');

        saveForLaterButton.addEventListener('click', () => saveMovie('por_ver'));
        saveWatchedButton.addEventListener('click', () => showRatingModal());
    }

    async function getMovieGenres(genreIds) {
        const apiKey = '998d343674fbacfea441d0e40df4f0ea';
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const genres = data.genres.filter(genre => genreIds.includes(genre.id));
            return genres.map(genre => genre.name);
        } catch (error) {
            console.error('Error al obtener los géneros:', error);
            return [];
        }
    }

    function saveMovie(status) {
        console.log(`Película guardada como ${status}:`, currentMovie.title);
        closeModal();
    }

    function showRatingModal() {
        modal.style.display = 'none';
        const ratingModal = document.createElement('div');
        ratingModal.classList.add('modal');
        document.body.appendChild(ratingModal);

        const ratingModalContent = document.createElement('div');
        ratingModalContent.classList.add('modal-content');
        ratingModal.appendChild(ratingModalContent);

        const ratingTitle = document.createElement('h3');
        ratingTitle.textContent = `Calificar ${currentMovie.title}`;
        ratingModalContent.appendChild(ratingTitle);

        const ratingInput = document.createElement('input');
        ratingInput.type = 'number';
        ratingInput.min = '1';
        ratingInput.max = '10';
        ratingInput.placeholder = 'Calificación (1-10)';
        ratingModalContent.appendChild(ratingInput);

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        ratingModalContent.appendChild(dateInput);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Guardar Calificación';
        ratingModalContent.appendChild(submitButton);

        const closeRatingButton = document.createElement('button');
        closeRatingButton.textContent = 'Cerrar';
        ratingModalContent.appendChild(closeRatingButton);

        submitButton.addEventListener('click', () => saveRating(ratingInput.value, dateInput.value));
        closeRatingButton.addEventListener('click', () => {
            ratingModal.style.display = 'none';
        });
    }

    function saveRating(rating, date) {
        if (rating >= 1 && rating <= 10 && date) {
            console.log(`Calificación guardada para ${currentMovie.title}:`, rating, date);
        } else {
            alert('Por favor, ingresa una calificación válida y una fecha.');
        }
    }

    // Cerrar el modal si se hace clic fuera de la ventana
    overlay.addEventListener('click', closeModal);

    closeModalButton.addEventListener('click', closeModal);

    function closeModal() {
        modal.classList.remove('open');
        overlay.classList.remove('show');
    }
});
