document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '998d343674fbacfea441d0e40df4f0ea';
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

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
    closeModalButton.textContent = '🗙';
    closeModalButton.classList.add('close-modal');
    modalContent.appendChild(closeModalButton);

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

    // Loader (rueda de carga)
    const loader = document.createElement('div');
    loader.classList.add('loader-overlay');
    loader.innerHTML = `
        <div class="loader"></div>`;
    document.body.appendChild(loader);

    modalLink.textContent = 'Ver más en TMDB';
    modalLink.target = '_blank';

    modalTrailerLink.textContent = 'Ver tráiler';
    modalTrailerLink.target = '_blank';
    modalTrailerLink.style.display = 'none';

    modalContent.append(modalPoster, modalDetails);
    modalDetails.append(
        modalTitle,
        modalReleaseDate,
        modalRating,
        modalDescription,
        modalGenres,
        modalDirector,
        modalActors,
        modalLink,
        modalTrailerLink
    );

    let currentMovie = null;

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();

        if (query) {
            loader.classList.add('show'); // Mostrar el loader cuando se empieza la búsqueda
            const movies = await searchMovies(query);
            displayMovies(movies);
            loader.classList.remove('show'); // Ocultar el loader después de recibir los resultados
        }
    });

    async function searchMovies(query) {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al buscar películas');
            }
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
        loader.classList.add('show'); // Mostrar loader al cargar detalles

        try {
            modalPoster.src = movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : "../assets/imgs/posterNotFound.jpg";
            modalTitle.textContent = movie.title;
            modalReleaseDate.innerHTML = `<strong>Fecha de estreno:</strong> ${movie.release_date || 'Desconocida'}`;

            if (movie.vote_average) {
                modalRating.innerHTML = `<strong>Calificación:</strong> <span style="font-weight: bold; color: ${getRatingColor(movie.vote_average)}">${movie.vote_average.toFixed(1)}</span>`;
            } else {
                modalRating.innerHTML = `<strong>Calificación:</strong> No disponible`;
            }

            modalDescription.textContent = movie.overview || 'Sin descripción disponible.';

            const genres = await getMovieGenres(movie.genre_ids);
            modalGenres.innerHTML = `<strong>Géneros:</strong> ${genres.length ? genres.join(', ') : 'No disponible'}`;

            modalLink.href = `https://www.themoviedb.org/movie/${movie.id}`;

            const { director, actors } = await getMovieCredits(movie.id);
            modalDirector.innerHTML = `<strong>Director:</strong> ${director || 'Desconocido'}`;
            modalActors.innerHTML = `<strong>Actores principales:</strong> ${actors.length ? actors.join(', ') : 'No disponible'}`;

            const trailerUrl = await getTrailer(movie.id);
            if (trailerUrl) {
                modalTrailerLink.href = trailerUrl;
                modalTrailerLink.style.display = 'inline-block';
            } else {
                modalTrailerLink.style.display = 'none';
            }

            // Botones de guardar
            modalDetails.querySelectorAll('button.saveLog-modal, button.saveWishlist-modal').forEach(btn => btn.remove());

            const saveLogButton = document.createElement('button');
            saveLogButton.textContent = 'Marcar como vista';
            saveLogButton.classList.add('saveLog-modal');
            saveLogButton.addEventListener('click', () => saveMovie('PLAYED'));
            modalDetails.appendChild(saveLogButton);

            const saveWishlistButton = document.createElement('button');
            saveWishlistButton.textContent = 'Añadir a wishlist';
            saveWishlistButton.classList.add('saveWishlist-modal');
            saveWishlistButton.addEventListener('click', () => saveMovie('WISHLIST'));
            modalDetails.appendChild(saveWishlistButton);

            overlay.classList.add('show');
            modal.classList.add('open');
        } catch (error) {
            console.error('Error al cargar detalles:', error);
        } finally {
            loader.classList.remove('show'); // Ocultar loader cuando termina
        }
    }

    async function getMovieGenres(genreIds) {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al obtener géneros');
            }
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
            if (!response.ok) {
                throw new Error('Error al obtener créditos');
            }
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
            if (!response.ok) {
                throw new Error('Error al obtener tráiler');
            }
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

    function showToast(message, type = 'success') {
        // Limpiar toasts anteriores
        document.querySelectorAll('.toast').forEach(toast => toast.remove());

        // Crear elemento toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Agregar confeti solo si no es un error
        if (type !== 'error') {
            const confettiContainer = document.createElement('div');
            confettiContainer.className = 'confetti-container';

            // Crear confeti (50 partículas)
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

        // Forzar reflow para activar la animación
        void toast.offsetWidth;

        // Mostrar toast
        toast.classList.add('show');

        // Ocultar y eliminar después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 2000);
    }

    async function saveMovie(status) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.id) {
            showToast('Debes iniciar sesión para guardar contenido');
            return;
        }

        if (!currentMovie) {
            showToast('No se ha seleccionado ninguna película');
            return;
        }

        // Extraer y convertir géneros y actores en arrays
        const genreText = modalGenres.textContent.replace('Géneros:', '').trim();
        const actorText = modalActors.textContent.replace('Actores principales:', '').trim();

        const genreList = genreText ? genreText.split(',').map(g => g.trim()) : [];
        const actorList = actorText ? actorText.split(',').map(a => a.trim()) : [];

        const movieData = {
            title: currentMovie.title,
            releaseYear: currentMovie.release_date ? parseInt(currentMovie.release_date.substring(0, 4)) : 0,
            director: modalDirector.textContent.replace('Director:', '').trim() || 'Desconocido',
            actors: actorList,
            genre: genreList,
            imageUrl: currentMovie.poster_path ? `https://image.tmdb.org/t/p/w300${currentMovie.poster_path}` : null,
            status: status,
            isFavorite: false,
            userId: currentUser.id
        };



        if (status === 'PLAYED') {
            // Mostrar el modal de calificación
            showRatingModal(async (userRating, watchedDate) => {
                // Completar los datos de la película con la calificación y la fecha
                movieData.userRating = userRating;
                movieData.watchedDate = watchedDate;

                // Guardar la película después de completar el modal
                await saveMovieToBackend(movieData);
            });
        } else {
            // Guardar directamente si es wishlist
            await saveMovieToBackend(movieData);
            closeModal()
        }
    }

    async function saveMovieToBackend(movieData) {
        try {
            const response = await fetch('http://localhost:8080/api/movies/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData)
            });

            if (!response.ok) throw new Error(await response.text());

            showToast('¡Película guardada con éxito!', 'success');
        } catch (error) {
            console.error('Error al guardar:', error);
            showToast('Error al guardar: ' + error.message, 'error');
        }
    }

    function showRatingModal(onComplete) {
        const ratingModal = document.querySelector('.rating-modal-container');
        const starRating = document.getElementById('star-rating');
        const saveButton = document.getElementById('save-rating');
        const cancelButton = document.getElementById('cancel-rating');
        const resetRatingButton = document.querySelector('.reset-rating');
        const dateInput = document.getElementById('watched-date');
        const resetDateButton = document.querySelector('.reset-date');

        // Establecer fecha actual por defecto
        dateInput.valueAsDate = new Date();

        // Resetear valores
        let selectedRating = null;
        let hoverRating = 0;

        // Generar 5 estrellas
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

            // Mostrar u ocultar botón de reset
            if (selectedRating !== null) {
                resetRatingButton.classList.add('visible');
            } else {
                resetRatingButton.classList.remove('visible');
            }
        }

        // Función para actualizar la visibilidad del botón de reset
        function updateResetDateVisibility() {
            if (dateInput.value) {
                resetDateButton.classList.add('visible');
            } else {
                resetDateButton.classList.remove('visible');
            }
        }

        // Escuchar cambios en el campo de fecha
        dateInput.addEventListener('input', updateResetDateVisibility);

        // Escuchar clic en el botón de reset
        resetDateButton.addEventListener('click', () => {
            dateInput.value = ''; // Vaciar el campo de fecha
            updateResetDateVisibility(); // Actualizar la visibilidad
        });

        // Inicializar visibilidad al cargar
        updateResetDateVisibility();

        // Manejar eventos de las estrellas
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

        // Resetear rating
        resetRatingButton.addEventListener('click', () => {
            selectedRating = null;
            updateStars();
        });

        // Resetear fecha
        resetDateButton.addEventListener('click', () => {
            dateInput.value = '';
        });

        // Mostrar el modal
        ratingModal.classList.add('open');

        // Función para cerrar el modal
        function closeRatingModal() {
            ratingModal.classList.remove('open');
        }

        // Manejar el botón de guardar
        saveButton.onclick = () => {
            const finalRating = selectedRating;
            const finalDate = dateInput.value || null;

            closeRatingModal();
            onComplete(finalRating, finalDate);
        };

        // Manejar el botón de cancelar
        cancelButton.onclick = closeRatingModal;

        // Permitir cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeRatingModal();
            }
        });

        // Inicializar vista
        updateStars();
    }

});