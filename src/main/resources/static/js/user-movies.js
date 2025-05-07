document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const moviesContainer = document.getElementById('movie-list');
    const viewedMoviesBtn = document.getElementById('viewed-movies-btn');
    const wishlistMoviesBtn = document.getElementById('wishlist-movies-btn');
    const sortBySelect = document.getElementById('sort-by');
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
            <a href="../html/profile.html" class="btn-primary">Iniciar sesión</a>
        `;
        emptyState.style.display = 'block';
    }

    function loadMovies(status) {
        showLoadingState();

        fetch(`http://localhost:8080/api/movies/user/${user.id}?status=${status}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar las películas');
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
                showEmptyState();
            })
            .finally(() => {
                loader.classList.remove('show');
            });
    }

    function showLoadingState() {
        moviesContainer.innerHTML = `
            <div class="loading-state">
                <p>Cargando películas...</p>
            </div>
        `;
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
                    <span><i class="fas fa-star"></i> ${movie.rating ? movie.rating.toFixed(1) : '?'}</span>
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

        const modalPoster = document.createElement('img');
        modalPoster.src = movie.imageUrl || '../assets/imgs/posterNotFound.jpg';
        modalPoster.alt = movie.title;

        const modalDetails = document.createElement('div');
        modalDetails.classList.add('modal-details');

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = movie.title;

        const modalYear = document.createElement('p');
        modalYear.innerHTML = `<strong>Año:</strong> ${movie.releaseYear || 'N/A'}`;

        const modalRating = document.createElement('p');
        modalRating.innerHTML = `<strong>Valoración:</strong> ${movie.rating ? `${movie.rating}/10` : 'No valorada'}`;

        const modalGenre = document.createElement('p');
        modalGenre.innerHTML = `<strong>Género:</strong> ${movie.genre || 'Desconocido'}`;

        const modalDirector = document.createElement('p');
        modalDirector.innerHTML = `<strong>Director:</strong> ${movie.director || 'Desconocido'}`;

        const modalStatus = document.createElement('p');
        modalStatus.innerHTML = `<strong>Estado:</strong> ${movie.status === 'PLAYED' ? 'Vista' : 'En wishlist'}`;

        modalDetails.append(modalTitle, modalYear, modalRating, modalGenre, modalDirector, modalStatus);
        modalContent.append(modalPoster, modalDetails);

        overlay.classList.add('show');
        modal.classList.add('open');

        loader.classList.remove('show');
    }

    function setupEventListeners() {
        viewedMoviesBtn.addEventListener('click', () => {
            currentFilter = 'PLAYED';
            toggleActiveButton(viewedMoviesBtn, wishlistMoviesBtn);
            loadMovies(currentFilter);
        });

        wishlistMoviesBtn.addEventListener('click', () => {
            currentFilter = 'WISHLIST';
            toggleActiveButton(wishlistMoviesBtn, viewedMoviesBtn);
            loadMovies(currentFilter);
        });

        closeModalButton.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    function toggleActiveButton(activeButton, inactiveButton) {
        // Actualizar los estados de los botones
        activeButton.classList.add('active');
        inactiveButton.classList.remove('active');

        // Actualizar el atributo data-active del contenedor
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