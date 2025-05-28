document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('authModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const authTitle = document.getElementById('authTitle');
    const authActionBtn = document.getElementById('authActionBtn');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const usernameInput = document.getElementById('authUsername');
    const emailInput = document.getElementById('authEmail');
    const emailIcon = emailInput?.previousElementSibling; // Ícono del email
    const temporalDropdown = document.getElementById('temporalDropdown');

    const passwordInput = document.getElementById('authPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordRequirements = document.getElementById('passwordRequirements');

    // Mostrar/ocultar contraseña
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // Validación en tiempo real de la contraseña
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePassword);
    }



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
        if (passwordRequirements) passwordRequirements.style.display = 'none';
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
        if (passwordRequirements) passwordRequirements.style.display = 'block';
        if (emailInput) emailInput.value = '';
    }

    // Función de validación de contraseña
    function validatePassword() {
        if (!isLoginMode) {
            const password = passwordInput.value;

            // Validar longitud
            document.getElementById('reqLength').classList.toggle('valid', password.length >= 8);
            // Validar números
            document.getElementById('reqNumber').classList.toggle('valid', /\d/.test(password));

            // Validar caracteres especiales
            document.getElementById('reqSpecial').classList.toggle('valid', /[@$!%*?&._]/.test(password));
        }
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

    // Mostrar el toast de notificación
    function showToast(message, type = 'success') {
        // Limpiar toasts anteriores
        document.querySelectorAll('.toast').forEach(toast => toast.remove());

        // Crear elemento toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Forzar reflow para activar la animación
        void toast.offsetWidth;

        // Mostrar toast
        toast.classList.add('show');

        // Ocultar y eliminar después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3000);
    }

    // Manejar el envío del formulario
    async function handleFormSubmit() {
        const usernameOrEmail = usernameInput?.value.trim();
        const password = passwordInput?.value.trim();
        const email = isLoginMode ? '' : emailInput?.value.trim();

        if (!usernameOrEmail || !password || (!isLoginMode && !email)) {
            showToast('Por favor completa todos los campos', 'error');
            return;
        }

        if (!isLoginMode) {
            // Validación de contraseña en frontend antes de enviar
            const isPasswordValid = (
                password.length >= 8 &&
                /\d/.test(password) &&
                /[@$!%*?&._]/.test(password)
            );

            if (!isPasswordValid) {
                showToast('La contraseña no cumple con los requisitos', 'error');
                return;
            }
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
            showToast(error.message, 'error');
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

    // Determina si el archivo actual está en la carpeta html/
    const isInHtmlFolder = window.location.pathname.includes('/html/');

    // Usa la ruta relativa adecuada
    const profileHref = isInHtmlFolder ? 'profile.html' : 'html/profile.html';

    if (userLogged && temporalDropdown) {
        // Reemplazar el enlace por el dropdown
        temporalDropdown.innerHTML = `
            <div class="dropdown">
                <a class="navLink profile-link" href="${profileHref}">${userLogged.username}</a>
                <div class="dropdown-content">
                    <a href="${isInHtmlFolder ? 'user-movies.html' : 'html/user-movies.html'}">User Movies</a>
                    <a href="${isInHtmlFolder ? 'user-games.html' : 'html/user-games.html'}">User Games</a>
                    <a href="${isInHtmlFolder ? 'user-albums.html' : 'html/user-albums.html'}">User Albums</a>
                    <a href="" id="logoutBtn">Cerrar Sesión</a>
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
                window.location.href= profileHref; // Redirigir a profile.html
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