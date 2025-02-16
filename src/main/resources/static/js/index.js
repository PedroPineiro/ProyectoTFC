document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("loginModal");
    const loginButton = document.getElementById("loginButton");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    // Evita que el usuario use la página sin iniciar sesión
    document.body.classList.add("modal-open");

    // Verificar si ya hay una sesión activa en localStorage
    if (localStorage.getItem("loggedInUser")) {
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    // Función para manejar el login
    loginButton.addEventListener("click", function () {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username && password) {
            localStorage.setItem("loggedInUser", username); // Guarda en localStorage
            alert("¡Bienvenido, " + username + "!");
            modal.style.display = "none";
            document.body.classList.remove("modal-open");
        } else {
            alert("Por favor, ingresa usuario y contraseña.");
        }
    });
});

document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    alert("Sesión cerrada");
    location.reload(); // Recargar la página para volver a mostrar el modal
});
