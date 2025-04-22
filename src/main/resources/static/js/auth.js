document.addEventListener('DOMContentLoaded', () => {

    const authModal = document.getElementById('authModal');
    const authTitle = document.getElementById('authTitle');
    const authActionBtn = document.getElementById('authActionBtn');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch('http://localhost:8080/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }

            localStorage.removeItem('currentUser');
            location.reload(); // recargar la página para mostrar el modal de login/registro
        });
    }

    let isLoginMode = false;

    // Mostrar modal automáticamente si no hay usuario logueado
    if (!localStorage.getItem('currentUser')) {
        authModal.style.display = 'block';
    }

    // Alternar entre login/registro
    toggleAuthMode.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        authTitle.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registro';
        authActionBtn.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
        document.getElementById('authEmail').style.display = isLoginMode ? 'none' : 'block';
    });

    // Manejar registro/login
    authActionBtn.addEventListener('click', async () => {
        const usernameOrEmail = document.getElementById('authUsername').value.trim();
        const password = document.getElementById('authPassword').value.trim();
        const email = isLoginMode ? '' : document.getElementById('authEmail').value.trim();

        if (!usernameOrEmail || !password || (!isLoginMode && !email)) {
            alert('Por favor completa todos los campos');
            return;
        }

        const endpoint = isLoginMode
            ? 'http://localhost:8080/api/auth/login'
            : 'http://localhost:8080/api/auth/register';

        const body = isLoginMode
            ? { usernameOrEmail, password }
            : { usernameOrEmail, password, email };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error desconocido');
            }

            localStorage.setItem('currentUser', JSON.stringify(data));
            updateUIForLoggedInUser(data);
            authModal.style.display = 'none';

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });

    // Actualizar la UI cuando el usuario está logueado
    function updateUIForLoggedInUser(user) {
        const profileLink = document.querySelector('.profile-link');
        if (profileLink) {
            profileLink.textContent = `${user.username} ▼`;
        }

        // Mostrar contenido protegido
        document.querySelectorAll('.protected-content').forEach(el => {
            el.style.display = 'block';
        });
    }

    // Si hay usuario logueado, actualizar la UI
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
});