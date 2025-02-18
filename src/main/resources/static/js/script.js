document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const modal = document.createElement('div'); // Modal de detalles
    const modalContent = document.createElement('div'); // Contenido del modal
    modal.appendChild(modalContent);
    modal.classList.add('modal');
    document.body.appendChild(modal);

    const closeModalButton = document.createElement('button'); // Botón de cierre
    closeModalButton.textContent = 'Cerrar';
    closeModalButton.classList.add('close-modal');
    modalContent.appendChild(closeModalButton);

    const modalPoster = document.createElement('img'); // Imagen del poster
    modalContent.appendChild(modalPoster);

    const modalTitle = document.createElement('h2'); // Título de la película
    modalContent.appendChild(modalTitle);

    const modalReleaseDate = document.createElement('p'); // Fecha de lanzamiento
    modalContent.appendChild(modalReleaseDate);

    const modalRating = document.createElement('p'); // Calificación global
    modalContent.appendChild(modalRating);

    const modalDescription = document.createElement('p'); // Descripción de la película
    modalContent.appendChild(modalDescription);

    const modalGenres = document.createElement('p'); // Géneros de la película
    modalContent.appendChild(modalGenres);

    const modalLink = document.createElement('a'); // Enlace a TMDB
    modalLink.textContent = 'Ver más en TMDB';
    modalLink.target = '_blank'; // Abrir en una nueva pestaña
    modalContent.appendChild(modalLink);

    const modalButtons = document.createElement('div'); // Botones de acción
    modalContent.appendChild(modalButtons);

    const saveForLaterButton = document.createElement('button');
    saveForLaterButton.textContent = 'Guardar como por ver';
    const saveWatchedButton = document.createElement('button');
    saveWatchedButton.textContent = 'Guardar como vista';

    modalButtons.appendChild(saveForLaterButton);
    modalButtons.appendChild(saveWatchedButton);

    let currentMovie = null; // Guardar la película actual seleccionada

    // Manejar el evento de envío del formulario
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            const movies = await searchMovies(query);
            displayMovies(movies);
        }
    });

    // Función para buscar películas a través de la API de TMDB
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

    // Función para mostrar las películas en la web
    function displayMovies(movies) {
        resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

        if (movies.length === 0) {
            resultsDiv.innerHTML = '<p>No se encontraron películas.</p>';
            return;
        }

        // Crear y mostrar las películas
        movies.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie');
            
            const movieTitle = document.createElement('h3');
            movieTitle.textContent = movie.title + ' (' + movie.release_date.substring(0, 4) + ')';

            const movieImg = document.createElement('img');
            movieImg.src = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
            movieImg.alt = movie.title;

            // Añadir evento de clic para mostrar detalles
            movieDiv.addEventListener('click', () => showMovieDetails(movie));

            movieDiv.appendChild(movieImg);
            movieDiv.appendChild(movieTitle);
            resultsDiv.appendChild(movieDiv);
        });
    }

    // Mostrar detalles de la película en un modal
    async function showMovieDetails(movie) {
        currentMovie = movie;
        modalPoster.src = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
        modalTitle.textContent = movie.title;
        modalReleaseDate.textContent = `Fecha de estreno: ${movie.release_date}`;
        modalRating.textContent = `Calificación: ${movie.vote_average}`;
        modalDescription.textContent = movie.overview || 'Sin descripción disponible.';
        
        // Obtener y mostrar géneros
        const genres = await getMovieGenres(movie.genre_ids);
        modalGenres.textContent = `Géneros: ${genres.join(', ')}`;
        
        modalLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
        modal.style.display = 'flex';

        // Mostrar los botones para guardar
        saveForLaterButton.addEventListener('click', () => saveMovie('por_ver'));
        saveWatchedButton.addEventListener('click', () => showRatingModal());
    }

    // Función para obtener los nombres de los géneros de la película
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

    // Función para guardar la película como "Por ver" o "Vista"
    function saveMovie(status) {
        // Aquí puedes agregar código para guardar la película en la base de datos con el estado correspondiente
        console.log(`Película guardada como ${status}:`, currentMovie.title);
        modal.style.display = 'none'; // Cerrar modal
    }

    // Mostrar el modal de calificación de la película
    function showRatingModal() {
        modal.style.display = 'none'; // Cerrar el modal principal

        // Crear el modal de calificación
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
            ratingModal.style.display = 'none'; // Cerrar modal
        });
    }

    // Función para guardar la calificación y la fecha de la película
    function saveRating(rating, date) {
        if (rating >= 1 && rating <= 10 && date) {
            // Aquí puedes agregar código para guardar la calificación y la fecha en la base de datos
            console.log(`Calificación guardada para ${currentMovie.title}:`, rating, date);
        } else {
            alert('Por favor, ingresa una calificación válida y una fecha.');
        }
    }

    // Cerrar el modal de detalles
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});
