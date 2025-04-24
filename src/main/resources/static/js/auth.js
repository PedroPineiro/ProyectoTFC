document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('authModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const authTitle = document.getElementById('authTitle');
    const authActionBtn = document.getElementById('authActionBtn');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const usernameInput = document.getElementById('authUsername');
    const passwordInput = document.getElementById('authPassword');
    const emailInput = document.getElementById('authEmail');
    const emailIcon = emailInput?.previousElementSibling; // Ícono del email
    const temporalDropdown = document.getElementById('temporalDropdown');

    let isLoginMode = true; // Estado inicial: modo "Iniciar Sesión"

    // Configurar el estado inicial del modal
    function setLoginMode() {
        isLoginMode = true;
        if (authTitle) authTitle.textContent = 'Iniciar Sesión';
        if (authActionBtn) authActionBtn.textContent = 'Iniciar Sesión';
        if (toggleAuthMode) toggleAuthMode.textContent = '¿Aún no tienes cuenta? Regístrate aquí';
        if (usernameInput) usernameInput.placeholder = 'Usuario o Email';
        if (emailInput) emailInput.style.display = 'none';
        if (emailIcon) emailIcon.style.display = 'none';
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (emailInput) emailInput.value = '';
    }

    function setRegisterMode() {
        isLoginMode = false;
        if (authTitle) authTitle.textContent = 'Registro';
        if (authActionBtn) authActionBtn.textContent = 'Registrarse';
        if (toggleAuthMode) toggleAuthMode.textContent = '¿Ya tienes cuenta? Inicia sesión';
        if (usernameInput) usernameInput.placeholder = 'Usuario';
        if (emailInput) emailInput.style.display = 'block';
        if (emailIcon) emailIcon.style.display = 'block';
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (emailInput) emailInput.value = '';
    }

    // Alternar entre login y registro
    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', () => {
            if (isLoginMode) {
                setRegisterMode();
            } else {
                setLoginMode();
            }
        });
    }

    // Manejar el envío del formulario
    async function handleFormSubmit() {
        const usernameOrEmail = usernameInput?.value.trim();
        const password = passwordInput?.value.trim();
        const email = isLoginMode ? '' : emailInput?.value.trim();

        if (!usernameOrEmail || !password || (!isLoginMode && !email)) {
            alert('Por favor completa todos los campos');
            return;
        }

        const endpoint = isLoginMode
            ? 'http://localhost:8080/api/auth/login'
            : 'http://localhost:8080/api/auth/register';

        const body = isLoginMode
            ? JSON.stringify({ usernameOrEmail, password })
            : JSON.stringify({ username: usernameOrEmail, password, email });

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error desconocido');
            }

            localStorage.setItem('currentUser', JSON.stringify(data));
            updateUIForLoggedInUser(data);
            closeModal(); // Cerrar modal al iniciar sesión
            location.reload(); // Recargar la página para reflejar el estado logueado
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }

    // Agregar evento al botón
    if (authActionBtn) {
        authActionBtn.addEventListener('click', handleFormSubmit);
    }

    // Agregar evento para detectar la tecla Enter
    [usernameInput, passwordInput, emailInput].forEach(input => {
        if (input) {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Evita el comportamiento por defecto
                    handleFormSubmit(); // Llama a la función de envío
                }
            });
        }
    });

    // Mostrar el modal y el fondo oscuro si no hay usuario logueado
    if (!localStorage.getItem('currentUser')) {
        authModal.style.display = 'block';
        modalOverlay.classList.add('active');
        setLoginMode();
    }

    // Ocultar el modal y el fondo oscuro
    function closeModal() {
        authModal.style.display = 'none';
        modalOverlay.classList.remove('active');
    }

    // Verificar si el usuario está logueado
    const userLogged = JSON.parse(localStorage.getItem('currentUser'));
    if (userLogged && temporalDropdown) {
        // Reemplazar el enlace por el dropdown
        temporalDropdown.innerHTML = `
            <div class="dropdown">
                <a class="navLink profile-link" href="profile.html">${userLogged.username}</a>
                <div class="dropdown-content">
                    <a href="user-movies.html">User Movies</a>
                    <a href="user-games.html">User Games</a>
                    <a href="user-albums.html">User Albums</a>
                    <a href="profile.html" id="logoutBtn">Cerrar Sesión</a>
                </div>
            </div>
        `;

        // Manejar cierre de sesión
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
                window.location.href = 'profile.html'; // Redirigir a profile.html
            });
        }
    }

    // Actualizar la UI cuando el usuario está logueado
    function updateUIForLoggedInUser(user) {
        const profileLink = document.querySelector('.profile-link');
        if (profileLink) {
            profileLink.textContent = `${user.username}`;
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