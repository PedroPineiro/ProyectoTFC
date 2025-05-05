document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const moviesContainer = document.getElementById('movie-list');
    const viewedMoviesBtn = document.getElementById('viewed-movies-btn');
    const wishlistMoviesBtn = document.getElementById('wishlist-movies-btn');
    const sortBySelect = document.getElementById('sort-by');
    const moviesCount = document.getElementById('movies-count');
    const emptyState = document.getElementById('empty-state');

    // Elementos del modal (usando el mismo estilo que en el buscador)
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');
    document.body.appendChild(modal);
    document.body.appendChild(overlay);

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modal.appendChild(modalContent);

    const closeModalButton = document.createElement('button');
    closeModalButton.innerHTML = '&times;';
    closeModalButton.classList.add('close-modal');
    modalContent.appendChild(closeModalButton);

    const loader = document.createElement('div');
    loader.classList.add('loader-overlay');
    loader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loader);

    let allUserMovies = [];
    let currentFilter = 'Played';

    // Inicialización
    init();

    function init() {
        if (!user) {
            showNotLoggedState();
            return;
        }

        loadMovies(currentFilter);
        setupEventListeners();
    }

    function showNotLoggedState() {
        moviesContainer.innerHTML = '';
        emptyState.innerHTML = `
            <i class="fas fa-exclamation-triangle fa-3x"></i>
            <h3>Inicia sesión para ver tus películas</h3>
            <p>Necesitas iniciar sesión para acceder a esta sección.</p>
        `;
        emptyState.style.display = 'block';
    }

    function loadMovies(status) {
        showLoadingState();

        fetch(`http://localhost:8080/api/movies/user/${user.id}?status=${status}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(movies => {
                allUserMovies = movies;
                updateMoviesCount(movies.length);
                displayMovies(movies);

                if (movies.length === 0) {
                    showEmptyState();
                } else {
                    hideEmptyState();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                moviesContainer.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error al cargar las películas. Intenta nuevamente.</p>
                    <button class="btn-primary" onclick="location.reload()">Reintentar</button>
                </div>
            `;
                showEmptyState();
            });
    }

    function showLoadingState() {
        moviesContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Cargando tus películas...</p>
            </div>
        `;
    }

    function updateMoviesCount(count) {
        moviesCount.textContent = count;
    }

    function displayMovies(movies) {
        moviesContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            moviesContainer.appendChild(movieCard);
        });
    }

    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        movieCard.innerHTML = `
            <img src="${movie.imageUrl || '../assets/imgs/posterNotFound.jpg'}" alt="${movie.title}">
            <div class="movie-overlay">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-meta">
                    <span>${movie.year || 'N/A'}</span>
                    <span><i class="fas fa-star"></i> ${movie.userRating || '?'}</span>
                </div>
            </div>
        `;

        movieCard.addEventListener('click', () => showMovieDetails(movie));
        return movieCard;
    }

    function showMovieDetails(movie) {
        loader.classList.add('show');

        // Limpiar el modal
        modalContent.innerHTML = '';
        modalContent.appendChild(closeModalButton);

        const modalPoster = document.createElement('img');
        modalPoster.src = movie.imageUrl || '../assets/imgs/posterNotFound.jpg';
        modalPoster.alt = movie.title;

        const modalDetails = document.createElement('div');
        modalDetails.classList.add('modal-details');

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = movie.title;

        const modalYear = document.createElement('p');
        modalYear.innerHTML = `<strong>Año:</strong> ${movie.year || 'N/A'}`;

        const modalRating = document.createElement('p');
        modalRating.innerHTML = `<strong>Tu valoración:</strong> ${movie.userRating ? `${movie.userRating}/10` : 'No valorada'}`;

        const modalGenre = document.createElement('p');
        modalGenre.innerHTML = `<strong>Género:</strong> ${movie.genre || 'Desconocido'}`;

        const modalDuration = document.createElement('p');
        modalDuration.innerHTML = `<strong>Duración:</strong> ${movie.duration ? `${movie.duration} min` : 'N/A'}`;

        const modalReleaseDate = document.createElement('p');
        modalReleaseDate.innerHTML = `<strong>Fecha de estreno:</strong> ${formatDate(movie.releaseDate)}`;

        const modalStatus = document.createElement('p');
        modalStatus.innerHTML = `<strong>Estado:</strong> ${movie.status === 'Played' ? 'Vista' : 'En wishlist'}`;

        // Botones de acción
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('modal-actions');

        const toggleStatusBtn = document.createElement('button');
        toggleStatusBtn.classList.add('saveLog-modal');
        toggleStatusBtn.innerHTML = `<i class="fas ${movie.status === 'Played' ? 'fa-bookmark' : 'fa-eye'}"></i> ${movie.status === 'Played' ? 'Mover a wishlist' : 'Marcar como vista'}`;
        toggleStatusBtn.addEventListener('click', () => toggleMovieStatus(movie));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('saveWishlist-modal');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
        deleteBtn.addEventListener('click', () => deleteMovie(movie.id));

        actionsDiv.appendChild(toggleStatusBtn);
        actionsDiv.appendChild(deleteBtn);

        modalDetails.append(
            modalTitle,
            modalYear,
            modalRating,
            modalGenre,
            modalDuration,
            modalReleaseDate,
            modalStatus,
            actionsDiv
        );

        modalContent.appendChild(modalPoster);
        modalContent.appendChild(modalDetails);

        overlay.classList.add('show');
        modal.classList.add('open');
        loader.classList.remove('show');
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    function showEmptyState() {
        emptyState.style.display = 'block';
    }

    function hideEmptyState() {
        emptyState.style.display = 'none';
    }

    function setupEventListeners() {
        viewedMoviesBtn.addEventListener('click', () => {
            currentFilter = 'Played';
            loadMovies(currentFilter);
            viewedMoviesBtn.classList.add('active');
            wishlistMoviesBtn.classList.remove('active');
        });

        wishlistMoviesBtn.addEventListener('click', () => {
            currentFilter = 'Wishlist';
            loadMovies(currentFilter);
            wishlistMoviesBtn.classList.add('active');
            viewedMoviesBtn.classList.remove('active');
        });

        sortBySelect.addEventListener('change', sortMovies);
        closeModalButton.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    function sortMovies() {
        const sortBy = sortBySelect.value;
        let sortedMovies = [...allUserMovies];

        switch (sortBy) {
            case 'title':
                sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'year':
                sortedMovies.sort((a, b) => (b.year || 0) - (a.year || 0));
                break;
            case 'user-rating':
                sortedMovies.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
                break;
            case 'genre':
                sortedMovies.sort((a, b) => (a.genre || '').localeCompare(b.genre || ''));
                break;
            case 'duration':
                sortedMovies.sort((a, b) => (b.duration || 0) - (a.duration || 0));
                break;
            case 'release-date':
                sortedMovies.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
                break;
            case 'popularity':
                sortedMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
            default:
                break;
        }

        displayMovies(sortedMovies.filter(movie => movie.status === currentFilter));
    }

    function closeModal() {
        modal.classList.remove('open');
        overlay.classList.remove('show');
    }

    function toggleMovieStatus(movie) {
        const newStatus = movie.status === 'Played' ? 'Wishlist' : 'Played';

        fetch(`http://localhost:8080/api/movies/${movie.id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el estado');
                }
                return response.json();
            })
            .then(updatedMovie => {
                // Actualizar la película en la lista local
                const index = allUserMovies.findIndex(m => m.id === updatedMovie.id);
                if (index !== -1) {
                    allUserMovies[index] = updatedMovie;
                }

                // Recargar las películas si el estado actual no coincide con el filtro
                if (updatedMovie.status !== currentFilter) {
                    loadMovies(currentFilter);
                }

                closeModal();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al actualizar el estado de la película');
            });
    }

    function deleteMovie(movieId) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta película de tu lista?')) {
            return;
        }

        fetch(`http://localhost:8080/api/movies/${movieId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la película');
                }

                // Eliminar la película de la lista local
                allUserMovies = allUserMovies.filter(movie => movie.id !== movieId);
                updateMoviesCount(allUserMovies.length);

                // Recargar la vista
                loadMovies(currentFilter);
                closeModal();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar la película');
            });
    }
});