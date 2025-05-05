document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const moviesContainer = document.getElementById('movie-list');
    const viewedMoviesBtn = document.getElementById('viewed-movies-btn');
    const wishlistMoviesBtn = document.getElementById('wishlist-movies-btn');
    const sortBySelect = document.getElementById('sort-by');

    let allUserMovies = []; // Almacenaremos todas las películas del usuario aquí
    let currentFilter = 'Played'; // Estado inicial del filtro

    function fetchAndDisplayMovies(status) {
        if (!user) {
            console.error('Usuario no encontrado en localStorage.');
            moviesContainer.innerHTML = '<p>No se ha iniciado sesión.</p>';
            return;
        }

        fetch(`http://localhost:8080/api/movies/user/${user.id}?status=${status}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Error al cargar las películas:', response.status);
                    moviesContainer.innerHTML = '<p>Error al cargar las películas.</p>';
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(movies => {
                allUserMovies = movies; // Guardamos todas las películas obtenidas
                displayMovies(allUserMovies);
            })
            .catch(error => console.error('Error:', error));
    }

    function displayMovies(movies) {
        moviesContainer.innerHTML = ''; // Limpiamos el contenedor
        if (movies.length > 0) {
            movies.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <img src="${movie.imageUrl}" alt="${movie.title} Carátula">
                `;
                moviesContainer.appendChild(movieCard);
            });
        } else {
            moviesContainer.innerHTML = '<p>No hay películas con este estado.</p>';
        }
    }

    // Cargar las películas "Played" al cargar la página
    fetchAndDisplayMovies(currentFilter);
    viewedMoviesBtn.classList.add('active'); // Marcar el botón "Películas Vistas" como activo inicialmente

    viewedMoviesBtn.addEventListener('click', () => {
        currentFilter = 'Played';
        fetchAndDisplayMovies(currentFilter);
        viewedMoviesBtn.classList.add('active');
        wishlistMoviesBtn.classList.remove('active');
    });

    wishlistMoviesBtn.addEventListener('click', () => {
        currentFilter = 'Wishlist';
        fetchAndDisplayMovies(currentFilter);
        wishlistMoviesBtn.classList.add('active');
        viewedMoviesBtn.classList.remove('active');
    });

    sortBySelect.addEventListener('change', () => {
        const sortBy = sortBySelect.value;
        let sortedMovies = [...allUserMovies]; // Creamos una copia para no modificar el array original

        switch (sortBy) {
            case 'title':
                sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'year':
                sortedMovies.sort((a, b) => (b.year || 0) - (a.year || 0)); // Orden descendente por año
                break;
            case 'user-rating':
                sortedMovies.sort((a, b) => (b.userRating || 0) - (a.userRating || 0)); // Orden descendente por valoración
                break;
            case 'genre':
                sortedMovies.sort((a, b) => a.genre.localeCompare(b.genre));
                break;
            case 'duration':
                sortedMovies.sort((a, b) => (b.duration || 0) - (a.duration || 0)); // Orden descendente por duración
                break;
            case 'release-date':
                sortedMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); // Orden descendente por fecha
                break;
            case 'popularity':
                sortedMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); // Orden descendente por popularidad
                break;
            default:
                break;
        }
        displayMovies(sortedMovies.filter(movie => movie.status === currentFilter));
    });
});