document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');

    // Mostrar mensaje de carga
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Cargando películas...';
    resultsDiv.appendChild(loadingMessage);

    // Manejar el evento de envío del formulario
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            loadingMessage.style.display = 'block'; // Mostrar mensaje de carga
            const movies = await searchMovies(query);
            displayMovies(movies);
            loadingMessage.style.display = 'none'; // Ocultar mensaje de carga
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
            
            // Enlace para ver más detalles
            const moreDetailsLink = document.createElement('a');
            moreDetailsLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
            moreDetailsLink.textContent = 'Ver más';
            moreDetailsLink.target = '_blank';

            movieDiv.appendChild(movieImg);
            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(moreDetailsLink);
            resultsDiv.appendChild(movieDiv);
        });
    }
});
