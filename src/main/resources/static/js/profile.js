document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // Mostrar información del usuario
    if (user) {
        document.getElementById('username-display').textContent = user.username;
        document.getElementById('email-display').textContent = user.email;
    }

    // Modales
    const changeUsernameModal = document.getElementById('changeUsernameModal');
    const changePasswordModal = document.getElementById('changePasswordModal');

    // Botones para abrir modales
    document.getElementById('change-username-btn').addEventListener('click', () => {
        changeUsernameModal.style.display = 'flex';
    });

    document.getElementById('change-password-btn').addEventListener('click', () => {
        changePasswordModal.style.display = 'flex';
    });

    // Botones para cerrar modales
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            changeUsernameModal.style.display = 'none';
            changePasswordModal.style.display = 'none';
        });
    });

    // Guardar nuevo nombre de usuario
    document.getElementById('save-username-btn').addEventListener('click', () => {
        const newUsername = document.getElementById('new-username').value.trim();
        if (newUsername) {
            user.username = newUsername;
            localStorage.setItem('currentUser', JSON.stringify(user));
            document.getElementById('username-display').textContent = newUsername;
            changeUsernameModal.style.display = 'none';
        }
    });

    // Guardar nueva contraseña (simulación)
    document.getElementById('save-password-btn').addEventListener('click', () => {
        const currentPassword = document.getElementById('current-password').value.trim();
        const newPassword = document.getElementById('new-password').value.trim();

        if (currentPassword && newPassword) {
            alert('Contraseña actualizada correctamente');
            changePasswordModal.style.display = 'none';
        }
    });

    // Cargar películas favoritas (simulación)
    const favoriteMovies = ['Inception', 'The Matrix', 'Interstellar'];
    const favoriteMoviesList = document.getElementById('favorite-movies-list');
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie;
        favoriteMoviesList.appendChild(li);
    });
});