document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("auth-modal");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const toggleLink = document.getElementById("toggle-form");
    const modalTitle = document.getElementById("modal-title");

    // Asegurarse de que el modal se vea
    modal.style.display = "flex";
    document.body.classList.add("modal-open");

    // ⏩ Alternar entre login y registro
    toggleLink.addEventListener("click", function (event) {
        event.preventDefault();

        if (loginForm.style.display === "none") {
            // Mostrar Login
            loginForm.style.display = "block";
            registerForm.style.display = "none";
            modalTitle.textContent = "Iniciar Sesión";
            toggleLink.textContent = "¿No tienes cuenta? Regístrate aquí";
        } else {
            // Mostrar Registro
            loginForm.style.display = "none";
            registerForm.style.display = "block";
            modalTitle.textContent = "Registrarse";
            toggleLink.textContent = "¿Ya tienes cuenta? Inicia sesión";
        }
    });

    // Función para manejar el cierre del modal después de iniciar sesión o registrarse
    function closeModal() {
        modal.style.display = "none"; // Oculta el modal
        document.body.classList.remove("modal-open"); // Permite hacer scroll en la página
    }

    // Manejar el inicio de sesión
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Aquí va la lógica para autenticar al usuario (puedes hacer una solicitud AJAX para verificar en el backend)
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        // Llamada al backend para verificar usuario y contraseña (simulación)
        fetch('/api/users/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                closeModal();  // Cierra el modal si la autenticación fue exitosa
            } else {
                alert("Credenciales incorrectas. Intenta nuevamente.");
            }
        })
        .catch(error => {
            console.error("Error al autenticar:", error);
            alert("Hubo un problema. Intenta nuevamente.");
        });
    });

    // Manejar el registro
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Aquí va la lógica para registrar al usuario (puedes hacer una solicitud AJAX para guardar en el backend)
        const username = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        // Llamada al backend para registrar usuario (simulación)
        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => {
            if (response.ok) {
                closeModal();  // Cierra el modal si el registro fue exitoso
            } else {
                alert("Hubo un error al registrar. Intenta nuevamente.");
            }
        })
        .catch(error => {
            console.error("Error al registrar:", error);
            alert("Hubo un problema. Intenta nuevamente.");
        });
    });
});
