document.addEventListener("DOMContentLoaded", () => {
    fetch("components/header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el header");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("header").innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el header:", error));
});