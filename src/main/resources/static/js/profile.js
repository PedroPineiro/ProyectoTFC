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
    }
});