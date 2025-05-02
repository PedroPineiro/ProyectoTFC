document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const moviesContainer = document.getElementById('user-movies');

    if (!moviesContainer) {
        console.error('El contenedor de películas no existe en el DOM.');
        return;
    }

    if (user) {
        document.getElementById('username-display').textContent = user.username;
        document.getElementById('email-display').textContent = user.email;

        fetch('http://localhost:8080/api/auth/me', { credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No autenticado');
                }
                return response.json();
            })
            .then(user => console.log('Usuario autenticado:', user))
            .catch(error => console.error('Error de autenticación:', error));
        fetch('http://localhost:8080/api/movies/user/' + user.id, { // Asegúrate de usar la URL correcta de tu backend
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        console.error('Endpoint no encontrado.');
                    } else if (response.status === 401) {
                        alert('No estás autorizado. Por favor, inicia sesión.');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(movies => {
                if (movies.length > 0) {
                    movies.forEach(movie => {
                        const movieCard = document.createElement('div');
                        movieCard.classList.add('movie-card');
                        movieCard.innerHTML = `
                            <h3>${movie.title}</h3>
                            <p>Director: ${movie.director}</p>
                            <p>Género: ${movie.genre}</p>
                            <p>Estado: ${movie.status}</p>
                        `;
                        moviesContainer.appendChild(movieCard);
                    });
                } else {
                    moviesContainer.innerHTML = '<p>No has guardado ninguna película aún.</p>';
                }
            })
            .catch(error => {
                console.error('Error al cargar las películas:', error);
                moviesContainer.innerHTML = '<p>Error al cargar tus películas.</p>';
            });
    }
});