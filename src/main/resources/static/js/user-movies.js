document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const moviesContainer = document.getElementById('movie-list');
    const viewedMoviesBtn = document.getElementById('viewed-movies-btn');
    const wishlistMoviesBtn = document.getElementById('wishlist-movies-btn');
    const sortBySelect = document.getElementById('sort-by');
    const sortDirectionBtn = document.getElementById('sort-direction-btn'); // Correcto ahora que el ID es "sort-direction-btn"
    const moviesCount = document.getElementById('movies-count');
    const emptyState = document.getElementById('empty-state');

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
    let currentFilter = 'PLAYED';
    let currentSortBy = sortBySelect.value; // Inicializar con el valor por defecto
    // Asegurarse de que el dataset se lea correctamente desde el elemento HTML
    let currentSortDirection = sortDirectionBtn.dataset.direction || 'desc'; // 'asc' o 'desc'

    init();

    function init() {
        if (!user) {
            showNotLoggedState();
            return;
        }

        // Pasa los parámetros de ordenación al cargar por primera vez
        loadMovies(currentFilter, currentSortBy, currentSortDirection);
        setupEventListeners();
        updateSortDirectionIcon(); // Actualizar el icono al inicio
    }

    function showToast(message, type = 'success') {
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        void toast.offsetWidth; // Trigger reflow
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

        // Construir la URL con los parámetros de ordenación
        // Usa el endpoint /user/{userId} que es más flexible
        const url = `http://localhost:8080/api/movies/user/${user.id}?status=${status}&sortBy=${sortBy}&sortDirection=${sortDirection}`;

        fetch(url, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    // Si la respuesta no es OK, intenta leer el cuerpo para obtener un mensaje de error
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
                // Muestra un mensaje de error al usuario si la carga falla
                showToast(`Error: ${error.message}`, 'error');
                showEmptyState(); // Asegura que se muestre el estado vacío si hay un error
            })
            .finally(() => {
                loader.classList.remove('show');
            });
    }

    function showLoadingState() {
        emptyState.style.display = 'none'; // Asegúrate de ocultar el estado vacío
        loader.classList.add('show'); // Muestra el loader
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
                    <span><i class="fas fa-star"></i> ${movie.userRating ? movie.userRating.toFixed(1) : (movie.globalRating ? movie.globalRating.toFixed(1) : '?')}</span>
                </div>
            </div>
        `;

        movieCard.addEventListener('click', () => showMovieDetails(movie));
        return movieCard;
    }

    function showMovieDetails(movie) {
        loader.classList.add('show');

        modalContent.innerHTML = '';
        modalContent.appendChild(closeModalButton);

        const modalDetails = document.createElement('div');
        modalDetails.classList.add('modal-details');

        // Columna izquierda
        const leftColumn = document.createElement('div');
        leftColumn.classList.add('modal-column');
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = movie.title;

        const modalYear = document.createElement('p');
        modalYear.innerHTML = `<strong>Año:</strong> ${movie.releaseYear || 'N/A'}`;

        const modalDirector = document.createElement('p');
        modalDirector.innerHTML = `<strong>Director:</strong> ${movie.director || 'Desconocido'}`;

        const modalActors = document.createElement('p');
        modalActors.innerHTML = `<strong>Actores:</strong> ${movie.actors || 'No disponible'}`;

        const modalGenre = document.createElement('p');
        modalGenre.innerHTML = `<strong>Género:</strong> ${movie.genre || 'Desconocido'}`;

        leftColumn.append(modalTitle, modalYear, modalDirector, modalActors, modalGenre);

        // Columna derecha
        const rightColumn = document.createElement('div');
        rightColumn.classList.add('modal-column');

        const descriptionButton = document.createElement('button');
        descriptionButton.textContent = 'Descripción: Abrir';
        descriptionButton.classList.add('btn-secondary');
        const modalDescription = document.createElement('p');
        modalDescription.textContent = movie.description || 'Sin descripción disponible.';
        modalDescription.style.display = 'none';

        descriptionButton.addEventListener('click', () => {
            const isVisible = modalDescription.style.display === 'block';
            modalDescription.style.display = isVisible ? 'none' : 'block';
            descriptionButton.textContent = isVisible ? 'Descripción: Abrir' : 'Descripción: Cerrar';
        });

        // Mostrar userRating si existe, de lo contrario globalRating
        const modalRating = document.createElement('div');
        modalRating.innerHTML = `<strong>Calificación:</strong> ${movie.userRating ? `${movie.userRating.toFixed(1)}/5 (tu valoración)` : (movie.globalRating ? `${movie.globalRating.toFixed(1)}/10 (IMDB)` : 'No valorada')}`;
        modalRating.classList.add('star-rating');


        const modalWatchedDate = document.createElement('p');
        modalWatchedDate.innerHTML = `<strong>Fecha de visualización:</strong> ${movie.watchedDate || 'No disponible'}`;

        rightColumn.append(descriptionButton, modalDescription, modalRating, modalWatchedDate);

        // Botones debajo de las columnas
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('modal-buttons');

        const toggleStatusButton = document.createElement('button');
        toggleStatusButton.textContent = movie.status === 'PLAYED' ? 'Mover a Wishlist' : 'Marcar como Vista';
        toggleStatusButton.classList.add('btn-primary');
        toggleStatusButton.addEventListener('click', () => toggleMovieStatus(movie));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar Película';
        deleteButton.classList.add('btn-danger');
        deleteButton.addEventListener('click', () => deleteMovie(movie.id));

        buttonsContainer.append(toggleStatusButton, deleteButton);

        modalDetails.append(leftColumn, rightColumn);
        modalContent.append(modalDetails, buttonsContainer);

        overlay.classList.add('show');
        modal.classList.add('open');

        loader.classList.remove('show');
    }

    function toggleMovieStatus(movie) {
        const newStatus = movie.status === 'PLAYED' ? 'WISHLIST' : 'PLAYED';

        fetch(`http://localhost:8080/api/movies/${movie.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'Error al cambiar el estado de la película'); });
                }
                return response.json();
            })
            .then(updatedMovie => {
                showToast('Estado actualizado con éxito', 'success');
                // IMPORTANTE: Recargar con los parámetros de ordenación y filtro actuales
                loadMovies(currentFilter, currentSortBy, currentSortDirection);
                closeModal(); // Cerrar el modal
            })
            .catch(error => {
                console.error('Error al cambiar el estado:', error);
                showToast('Error al cambiar el estado: ' + error.message, 'error');
            });
    }

    function deleteMovie(movieId) {
        fetch(`http://localhost:8080/api/movies/${movieId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw new Error(err.error || 'Error al eliminar la película'); });
                }
                showToast('Película eliminada con éxito', 'success');
                // IMPORTANTE: Recargar con los parámetros de ordenación y filtro actuales
                loadMovies(currentFilter, currentSortBy, currentSortDirection);
                closeModal(); // Cerrar el modal
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
            loadMovies(currentFilter, currentSortBy, currentSortDirection); // Recargar con ordenación
        });

        wishlistMoviesBtn.addEventListener('click', () => {
            currentFilter = 'WISHLIST';
            toggleActiveButton(wishlistMoviesBtn, viewedMoviesBtn);
            loadMovies(currentFilter, currentSortBy, currentSortDirection); // Recargar con ordenación
        });

        sortBySelect.addEventListener('change', () => {
            currentSortBy = sortBySelect.value;
            updateSortDirectionIcon(); // Actualiza el icono al cambiar el tipo de ordenación
            loadMovies(currentFilter, currentSortBy, currentSortDirection); // Recargar con nueva ordenación
        });

        sortDirectionBtn.addEventListener('click', () => {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            sortDirectionBtn.dataset.direction = currentSortDirection; // Actualizar el dataset
            updateSortDirectionIcon(); // Actualizar el icono
            loadMovies(currentFilter, currentSortBy, currentSortDirection); // Recargar con nueva dirección
        });

        closeModalButton.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    function updateSortDirectionIcon() {
        const icon = sortDirectionBtn.querySelector('i');
        if (currentSortDirection === 'asc') {
            switch (currentSortBy) {
                case 'title':
                case 'genre':
                    icon.className = 'fas fa-sort-amount-down-alt';
                    break;
                case 'releaseYear':
                    icon.className = 'fas fa-sort-numeric-down';
                    break;
                case 'userRating':
                    icon.className = 'fas fa-sort-amount-down-alt';
                    break;
                default:
                    icon.className = 'fas fa-sort-amount-down-alt';
                    break;
            }
        } else { // 'desc'
            switch (currentSortBy) {
                case 'title':
                case 'genre':
                    icon.className = 'fas fa-sort-amount-up-alt';
                    break;
                case 'releaseYear':
                    icon.className = 'fas fa-sort-numeric-up';
                    break;
                case 'userRating':
                    icon.className = 'fas fa-sort-amount-up-alt';
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
        overlay.classList.remove('show');
    }
});