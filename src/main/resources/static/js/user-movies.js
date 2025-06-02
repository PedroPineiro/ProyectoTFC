document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const moviesContainer = document.getElementById('movie-list');
    const viewedMoviesBtn = document.getElementById('viewed-movies-btn');
    const wishlistMoviesBtn = document.getElementById('wishlist-movies-btn');
    const sortBySelect = document.getElementById('sort-by');
    const sortDirectionBtn = document.getElementById('sort-direction-btn');
    const moviesCount = document.getElementById('movies-count');
    const emptyState = document.getElementById('empty-state');

    // Referenciar el modal y sus elementos existentes en el HTML
    const modal = document.getElementById('movie-modal');
    const closeModalButton = modal.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Referencias a los elementos de contenido dentro del modal
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalYear = document.getElementById('modal-year');
    const modalDirector = document.getElementById('modal-director');
    const modalActors = document.getElementById('modal-actors');
    const modalGenre = document.getElementById('modal-genre');
    const modalDuration = document.getElementById('modal-duration');
    const descriptionButton = document.getElementById('description-button');
    const modalDescription = document.getElementById('modal-description');
    const modalGlobalRating = document.getElementById('modal-global-rating');
    const modalUserRating = document.getElementById('modal-user-rating');
    const modalWatchedDate = document.getElementById('modal-watched-date');
    const toggleStatusButton = document.getElementById('toggle-status-button');
    const deleteButton = document.getElementById('delete-button');

    // Loader
    const loader = document.createElement('div');
    loader.classList.add('loader-overlay');
    loader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loader);

    let currentFilter = 'PLAYED';
    let currentSortBy = sortBySelect.value;
    let currentSortDirection = sortDirectionBtn.dataset.direction || 'desc';
    let currentMovieInModal = null;

    init();

    function init() {
        if (!user) {
            showNotLoggedState();
            return;
        }

        loadMovies(currentFilter, currentSortBy, currentSortDirection);
        setupEventListeners();
        updateSortDirectionIcon();
        toggleActiveButton(viewedMoviesBtn, wishlistMoviesBtn);
    }

    function showToast(message, type = 'success') {
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3000);
    }

    function showNotLoggedState() {
        moviesContainer.innerHTML = '';
        emptyState.innerHTML = `
            <i class="fas fa-exclamation-triangle fa-3x"></i>
            <h3>Inicia sesión para ver tus películas</h3>
            <p>Necesitas iniciar sesión para acceder a esta sección.</p>
            <a href="../html/profile.html" class="btn-primary">Iniciar sesión</a>
        `;
        emptyState.style.display = 'block';
    }

    function loadMovies(status, sortBy, sortDirection) {
        showLoadingState();

        const url = `http://localhost:8080/api/movies/user/${user.id}?status=${status}&sortBy=${sortBy}&sortDirection=${sortDirection}`;

        fetch(url, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'Error al cargar las películas'); });
                }
                return response.json();
            })
            .then(movies => {
                allUserMovies = movies;
                updateMoviesCount(movies.length);
                if (movies.length === 0) {
                    showEmptyState();
                } else {
                    displayMovies(movies);
                }
            })
            .catch(error => {
                console.error('Error al cargar las películas:', error);
                showToast(`Error: ${error.message}`, 'error');
                showEmptyState();
            })
            .finally(() => {
                loader.classList.remove('show');
            });
    }

    function showLoadingState() {
        emptyState.style.display = 'none';
        loader.classList.add('show');
    }

    function showEmptyState() {
        moviesContainer.innerHTML = '';
        emptyState.style.display = 'block';
    }

    function updateMoviesCount(count) {
        moviesCount.textContent = count;
    }

    function displayMovies(movies) {
        moviesContainer.innerHTML = '';
        emptyState.style.display = 'none';

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
                    <span>${movie.releaseYear || 'N/A'}</span>
                    <span><i class="fas fa-star"></i> ${movie.userRating || '-'}</span>
                </div>
            </div>
        `;

        movieCard.addEventListener('click', () => showMovieDetails(movie));
        return movieCard;
    }

    function showMovieDetails(movie) {
        loader.classList.add('show');
        currentMovieInModal = movie;

        // Reiniciar estado del botón de descripción y texto
        descriptionButton.textContent = 'Mostrar descripción ▲';
        modalDescription.style.display = 'none';

        // Rellenar los elementos del modal con los datos de la película
        modalImage.src = movie.imageUrl || '../assets/imgs/posterNotFound.jpg';
        modalImage.alt = movie.title;
        modalTitle.textContent = movie.title;
        modalYear.textContent = movie.releaseYear || 'N/A';
        modalDirector.textContent = movie.director || 'Desconocido';
        modalActors.textContent = movie.actors?.length ? movie.actors.join(', ') : 'Desconocidos';
        modalGenre.textContent = movie.genre?.length ? movie.genre.join(', ') : 'Desconocido';
        modalDuration.textContent = movie.duration ? `${movie.duration} min` : 'Desconocida';
        modalDescription.textContent = movie.description || 'Sin descripción disponible.';

        modalUserRating.textContent = movie.userRating || 'No valorada';
        modalGlobalRating.textContent = movie.globalRating || 'No valorada';
        modalWatchedDate.textContent = movie.watchedDate || 'No disponible';

        // Actualizar el texto del botón de estado
        toggleStatusButton.textContent = movie.status === 'PLAYED' ? 'Mover a Wishlist' : 'Marcar como Vista';

        modalOverlay.classList.add('show');
        modal.classList.add('open');

        loader.classList.remove('show');
    }

    function toggleMovieStatus() {
        if (!currentMovieInModal) return; // Ensure a movie is loaded

        const newStatus = currentMovieInModal.status === 'PLAYED' ? 'WISHLIST' : 'PLAYED';
        const now = new Date().toISOString();

        fetch(`http://localhost:8080/api/movies/${currentMovieInModal.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: newStatus,
                addedDate: now
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'Error al cambiar el estado de la película'); });
                }
                return response.json();
            })
            .then(updatedMovie => {
                showToast('Estado actualizado con éxito', 'success');
                loadMovies(currentFilter, currentSortBy, currentSortDirection);
                closeModal();
            })
            .catch(error => {
                console.error('Error al cambiar el estado:', error);
                showToast('Error al cambiar el estado: ' + error.message, 'error');
            });
    }

    function deleteMovie() {
        if (!currentMovieInModal) return; // Ensure a movie is loaded

        fetch(`http://localhost:8080/api/movies/${currentMovieInModal.id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'Error al eliminar la película'); });
                }
                showToast('Película eliminada con éxito', 'success');
                loadMovies(currentFilter, currentSortBy, currentSortDirection);
                closeModal();
            })
            .catch(error => {
                console.error('Error al eliminar la película:', error);
                showToast('Error al eliminar la película: ' + error.message, 'error');
            });
    }

    function setupEventListeners() {
        viewedMoviesBtn.addEventListener('click', () => {
            currentFilter = 'PLAYED';
            toggleActiveButton(viewedMoviesBtn, wishlistMoviesBtn);
            loadMovies(currentFilter, currentSortBy, currentSortDirection);
        });

        wishlistMoviesBtn.addEventListener('click', () => {
            currentFilter = 'WISHLIST';
            toggleActiveButton(wishlistMoviesBtn, viewedMoviesBtn);
            loadMovies(currentFilter, currentSortBy, currentSortDirection);
        });

        sortBySelect.addEventListener('change', () => {
            currentSortBy = sortBySelect.value;
            updateSortDirectionIcon();
            loadMovies(currentFilter, currentSortBy, currentSortDirection);
        });

        sortDirectionBtn.addEventListener('click', () => {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            sortDirectionBtn.dataset.direction = currentSortDirection;
            updateSortDirectionIcon();
            loadMovies(currentFilter, currentSortBy, currentSortDirection);
        });

        closeModalButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        // Event listeners for modal action buttons, attached ONCE
        descriptionButton.addEventListener('click', () => {
            const isVisible = modalDescription.style.display === 'block';
            modalDescription.style.display = isVisible ? 'none' : 'block';
            descriptionButton.textContent = isVisible ? 'Mostrar descripción ▲' : 'Ocultar descripción ▼';
        });

        toggleStatusButton.addEventListener('click', toggleMovieStatus);
        deleteButton.addEventListener('click', deleteMovie);
    }

    function updateSortDirectionIcon() {
        const icon = sortDirectionBtn.querySelector('i');
        if (currentSortDirection === 'asc') {
            switch (currentSortBy) {
                case 'title':
                case 'genre':
                    icon.className = 'fas fa-sort-alpha-down';
                    break;
                case 'releaseYear':
                    icon.className = 'fas fa-sort-numeric-down';
                    break;
                case 'userRating':
                    icon.className = 'fas fa-sort-amount-down-alt';
                    break;
                case 'duration':
                    icon.className = 'fas fa-sort-numeric-down';
                    break;
                default:
                    icon.className = 'fas fa-sort-amount-down-alt';
                    break;
            }
        } else { // 'desc'
            switch (currentSortBy) {
                case 'title':
                case 'genre':
                    icon.className = 'fas fa-sort-alpha-up';
                    break;
                case 'releaseYear':
                    icon.className = 'fas fa-sort-numeric-up';
                    break;
                case 'userRating':
                    icon.className = 'fas fa-sort-amount-up-alt';
                    break;
                case 'duration':
                    icon.className = 'fas fa-sort-numeric-down';
                    break;
                default:
                    icon.className = 'fas fa-sort-amount-up-alt';
                    break;
            }
        }
    }

    function toggleActiveButton(activeButton, inactiveButton) {
        activeButton.classList.add('active');
        inactiveButton.classList.remove('active');
        const toggleContainer = document.querySelector('.toggle-view');
        if (activeButton.id === 'viewed-movies-btn') {
            toggleContainer.setAttribute('data-active', 'viewed');
        } else {
            toggleContainer.setAttribute('data-active', 'wishlist');
        }
    }

    function closeModal() {
        modal.classList.remove('open');
        modalOverlay.classList.remove('show');
        currentMovieInModal = null; // Clear the stored movie
    }
});