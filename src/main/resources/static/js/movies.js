document.addEventListener('DOMContentLoaded', () => {
    // Configuración
    const config = {
        apiKey: '998d343674fbacfea441d0e40df4f0ea',
        apiBaseUrl: 'https://api.themoviedb.org/3',
        posterBaseUrl: 'https://image.tmdb.org/t/p/',
        backendUrl: 'http://localhost:8080/api/movies/add'
    };

    // Elementos del DOM
    const elements = {
        searchForm: document.getElementById('searchForm'),
        searchInput: document.getElementById('searchInput'),
        results: document.getElementById('results'),
        movieModal: document.getElementById('movieModal'),
        modalOverlay: document.querySelector('.modal-overlay'),
        loader: document.querySelector('.loader-overlay'),
        ratingModal: document.getElementById('rating-modal')
    };

    // Elementos del modal de película
    const modalElements = {
        poster: document.querySelector('.modal-poster'),
        title: document.querySelector('.modal-title'),
        releaseDate: document.querySelector('.modal-release-date .value'),
        rating: document.querySelector('.modal-rating .value'),
        description: document.querySelector('.modal-description'),
        genres: document.querySelector('.modal-genres .value'),
        director: document.querySelector('.modal-director .value'),
        actors: document.querySelector('.modal-actors .value'),
        tmdbLink: document.querySelector('.tmdb-link'),
        trailerLink: document.querySelector('.trailer-link'),
        saveLogButton: document.querySelector('.saveLog-modal'),
        saveWishlistButton: document.querySelector('.saveWishlist-modal'),
        closeButton: document.querySelector('.close-modal')
    };

    // Estado de la aplicación
    const state = {
        currentMovie: null,
        currentUser: JSON.parse(localStorage.getItem('currentUser'))
    };

    // Inicialización de eventos
    function initEventListeners() {
        // Formulario de búsqueda
        elements.searchForm.addEventListener('submit', handleSearch);

        // Modal
        elements.modalOverlay.addEventListener('click', closeModal);
        modalElements.closeButton.addEventListener('click', closeModal);

        // Botones de guardar
        modalElements.saveLogButton.addEventListener('click', () => saveMovie('PLAYED'));
        modalElements.saveWishlistButton.addEventListener('click', () => saveMovie('WISHLIST'));
    }

    // Manejador de búsqueda
    async function handleSearch(event) {
        event.preventDefault();
        const query = elements.searchInput.value.trim();

        if (query) {
            showLoader();
            try {
                const movies = await searchMovies(query);
                displayMovies(movies);
            } catch (error) {
                console.error('Error en la búsqueda:', error);
                elements.results.innerHTML = '<p>Error al buscar películas. Inténtalo de nuevo.</p>';
            } finally {
                hideLoader();
            }
        }
    }

    // Buscar películas en la API
    async function searchMovies(query) {
        const url = `${config.apiBaseUrl}/search/movie?api_key=${config.apiKey}&query=${query}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al buscar películas');
        }

        const data = await response.json();
        return data.results;
    }

    // Mostrar resultados de películas
    function displayMovies(movies) {
        elements.results.innerHTML = '';

        if (movies.length === 0) {
            elements.results.innerHTML = '<p>No se encontraron películas.</p>';
            return;
        }

        movies.forEach(movie => {
            const movieElement = createMovieElement(movie);
            elements.results.appendChild(movieElement);
        });
    }

    // Crear elemento de película
    function createMovieElement(movie) {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const movieImg = document.createElement('img');
        movieImg.src = movie.poster_path
            ? `${config.posterBaseUrl}w200${movie.poster_path}`
            : "../assets/imgs/posterNotFound.jpg";
        movieImg.alt = movie.title;

        const movieTitle = document.createElement('h3');
        movieTitle.textContent = `${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})`;

        movieDiv.addEventListener('click', () => showMovieDetails(movie));
        movieDiv.append(movieImg, movieTitle);

        return movieDiv;
    }

    // Mostrar detalles de la película
    async function showMovieDetails(movie) {
        state.currentMovie = movie;
        showLoader();

        try {
            // Configurar elementos del modal con los datos básicos
            modalElements.poster.src = movie.poster_path
                ? `${config.posterBaseUrl}w300${movie.poster_path}`
                : "../assets/imgs/posterNotFound.jpg";

            modalElements.title.textContent = movie.title;
            modalElements.releaseDate.textContent = movie.release_date || 'Desconocida';
            modalElements.description.textContent = movie.overview || 'Sin descripción disponible.';
            modalElements.tmdbLink.href = `https://www.themoviedb.org/movie/${movie.id}`;

            // Calificación con color
            if (movie.vote_average) {
                modalElements.rating.textContent = movie.vote_average.toFixed(1);
                modalElements.rating.style.color = getRatingColor(movie.vote_average);
            } else {
                modalElements.rating.textContent = 'No disponible';
                modalElements.rating.style.color = '';
            }

            // Obtener datos adicionales
            const [genres, credits, trailerUrl] = await Promise.all([
                getMovieGenres(movie.genre_ids),
                getMovieCredits(movie.id),
                getTrailer(movie.id)
            ]);

            // Actualizar modal con datos adicionales
            modalElements.genres.textContent = genres.length ? genres.join(', ') : 'No disponible';
            modalElements.director.textContent = credits.director || 'Desconocido';
            modalElements.actors.textContent = credits.actors.length ? credits.actors.join(', ') : 'No disponible';

            // Configurar enlace del tráiler
            if (trailerUrl) {
                modalElements.trailerLink.href = trailerUrl;
                modalElements.trailerLink.style.display = 'inline-block';
            } else {
                modalElements.trailerLink.style.display = 'none';
            }

            // Mostrar/ocultar descripción
            const descriptionButton = document.querySelector('.description-toggle');

            descriptionButton.onclick = () => {
                const isVisible = modalElements.description.style.display === 'block';
                modalElements.description.style.display = isVisible ? 'none' : 'block';
                descriptionButton.textContent = isVisible ? 'Mostrar descripción ▲' : 'Ocultar descripción ▼';
            };

            // Mostrar modal
            openModal();
        } catch (error) {
            console.error('Error al cargar detalles:', error);
            showToast('Error al cargar detalles de la película', 'error');
        } finally {
            hideLoader();
        }
    }

    // Obtener géneros de la película
    async function getMovieGenres(genreIds) {
        const url = `${config.apiBaseUrl}/genre/movie/list?api_key=${config.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener géneros');
        }

        const data = await response.json();
        return data.genres
            .filter(genre => genreIds.includes(genre.id))
            .map(genre => genre.name);
    }

    // Obtener créditos de la película
    async function getMovieCredits(movieId) {
        const url = `${config.apiBaseUrl}/movie/${movieId}/credits?api_key=${config.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener créditos');
        }

        const data = await response.json();
        const director = data.crew.find(person => person.job === 'Director')?.name || null;
        const actors = data.cast.slice(0, 5).map(actor => actor.name);

        return { director, actors };
    }

    // Obtener tráiler de la película
    async function getTrailer(movieId) {
        const url = `${config.apiBaseUrl}/movie/${movieId}/videos?api_key=${config.apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener tráiler');
        }

        const data = await response.json();
        const trailer = data.results.find(video => video.type === 'Trailer');
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    }

    // Guardar película
    async function saveMovie(status) {
        if (!state.currentUser?.id) {
            showToast('Debes iniciar sesión para guardar contenido', 'error');
            return;
        }

        if (!state.currentMovie) {
            showToast('No se ha seleccionado ninguna película', 'error');
            return;
        }

        // Extraer datos del modal
        const genreText = modalElements.genres.textContent;
        const actorText = modalElements.actors.textContent;
        const directorText = modalElements.director.textContent;

        const movieData = {
            title: state.currentMovie.title,
            releaseYear: state.currentMovie.release_date
                ? parseInt(state.currentMovie.release_date.substring(0, 4))
                : 0,
            director: directorText || 'Desconocido',
            actors: actorText ? actorText.split(',').map(a => a.trim()) : [],
            genre: genreText ? genreText.split(',').map(g => g.trim()) : [],
            imageUrl: state.currentMovie.poster_path
                ? `${config.posterBaseUrl}w300${state.currentMovie.poster_path}`
                : null,
            status: status,
            isFavorite: false,
            userId: state.currentUser.id
        };

        if (status === 'PLAYED') {
            showRatingModal(async (userRating, watchedDate) => {
                movieData.userRating = userRating;
                movieData.watchedDate = watchedDate;
                await saveMovieToBackend(movieData);
            });
        } else {
            await saveMovieToBackend(movieData);
            closeModal();
        }
    }

    // Guardar película en el backend
    async function saveMovieToBackend(movieData) {
        try {
            const response = await fetch(config.backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            showToast('¡Película guardada con éxito!', 'success');
        } catch (error) {
            console.error('Error al guardar:', error);
            showToast('Error al guardar: ' + error.message, 'error');
        }
    }

    // Mostrar modal de calificación
    function showRatingModal(onComplete) {
        const starRating = document.getElementById('star-rating');
        const saveButton = document.getElementById('save-rating');
        const cancelButton = document.getElementById('cancel-rating');
        const resetRatingButton = document.querySelector('.reset-rating');
        const dateInput = document.getElementById('watched-date');
        const resetDateButton = document.querySelector('.reset-date');

        // Configuración inicial
        dateInput.valueAsDate = new Date();
        let selectedRating = null;
        let hoverRating = 0;

        // Generar estrellas
        starRating.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.dataset.value = i;
            star.innerHTML = '★';
            starRating.appendChild(star);
        }

        const stars = starRating.querySelectorAll('.star');

        // Actualizar visualización de estrellas
        function updateStars() {
            const ratingToShow = hoverRating || selectedRating;

            stars.forEach((star) => {
                star.classList.remove('selected', 'half');
                const starValue = parseFloat(star.dataset.value);

                if (ratingToShow >= starValue) {
                    star.classList.add('selected');
                } else if (ratingToShow >= starValue - 0.5) {
                    star.classList.add('half');
                }
            });

            resetRatingButton.classList.toggle('visible', selectedRating !== null);
            resetDateButton.classList.toggle('visible', !!dateInput.value);
        }

        // Eventos
        starRating.addEventListener('mousemove', (e) => {
            if (!e.target.classList.contains('star')) return;

            const star = e.target;
            const rect = star.getBoundingClientRect();
            const xPos = e.clientX - rect.left;
            const starWidth = rect.width;
            const starValue = parseFloat(star.dataset.value);

            hoverRating = xPos < starWidth / 2 ? starValue - 0.5 : starValue;
            updateStars();
        });

        starRating.addEventListener('mouseleave', () => {
            hoverRating = 0;
            updateStars();
        });

        starRating.addEventListener('click', (e) => {
            if (!e.target.classList.contains('star')) return;

            const star = e.target;
            const rect = star.getBoundingClientRect();
            const xPos = e.clientX - rect.left;
            const starWidth = rect.width;
            const starValue = parseFloat(star.dataset.value);

            selectedRating = xPos < starWidth / 2 ? starValue - 0.5 : starValue;
            updateStars();
        });

        resetRatingButton.addEventListener('click', () => {
            selectedRating = null;
            updateStars();
        });

        dateInput.addEventListener('input', () => {
            resetDateButton.classList.toggle('visible', !!dateInput.value);
        });

        resetDateButton.addEventListener('click', () => {
            dateInput.value = '';
            resetDateButton.classList.remove('visible');
        });

        // Mostrar modal
        elements.ratingModal.classList.add('open');

        // Cerrar modal
        function closeRatingModal() {
            elements.ratingModal.classList.remove('open');
        }

        // Guardar
        saveButton.onclick = () => {
            closeRatingModal();
            onComplete(selectedRating, dateInput.value || null);
        };

        // Cancelar
        cancelButton.onclick = closeRatingModal;

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeRatingModal();
        });

        updateStars();
    }

    // Mostrar toast
    function showToast(message, type = 'success') {
        // Limpiar toasts anteriores
        document.querySelectorAll('.toast').forEach(toast => toast.remove());

        // Crear toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Confeti para éxito
        if (type !== 'error') {
            const confettiContainer = document.createElement('div');
            confettiContainer.className = 'confetti-container';

            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.animationDelay = `${Math.random() * 0.5}s`;
                confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
                const size = 6 + Math.random() * 10;
                confetti.style.width = `${size}px`;
                confetti.style.height = `${size}px`;
                confettiContainer.appendChild(confetti);
            }

            toast.appendChild(confettiContainer);
        }

        document.body.appendChild(toast);
        void toast.offsetWidth; // Forzar reflow
        toast.classList.add('show');

        // Ocultar después de 2 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    // Mostrar/ocultar loader
    function showLoader() {
        elements.loader.classList.add('show');
    }

    function hideLoader() {
        elements.loader.classList.remove('show');
    }

    // Abrir/cerrar modal
    function openModal() {
        elements.movieModal.classList.add('open');
        elements.modalOverlay.classList.add('show');
    }

    function closeModal() {
        elements.movieModal.classList.remove('open');
        elements.modalOverlay.classList.remove('show');
    }

    // Obtener color de calificación
    function getRatingColor(rating) {
        return rating <= 3 ? 'red' :
            rating <= 5 ? 'orange' :
                rating <= 8 ? 'yellow' : 'green';
    }

    // Inicializar la aplicación
    initEventListeners();
});