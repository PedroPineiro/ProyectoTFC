document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita que la página se recargue
        const query = searchInput.value.trim();
        if (query === "") return;

        try {
            const response = await fetch(`http://localhost:8080/api/movies/search?query=${query}`, {
                method: "GET",
                mode: "cors" //Arregla el error de CORS
            });

            const data = await response.json();

            resultsDiv.innerHTML = ""; // Limpiar resultados previos
            data.results.forEach(movie => {
                const movieElement = document.createElement("div");
                movieElement.classList.add("movie");

                movieElement.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} ">
                    <h3>${movie.title} (${movie.release_date ? movie.release_date.split("-")[0] : "N/A"})</h3>
                `;
                resultsDiv.appendChild(movieElement);
            });

        } catch (error) {
            console.error("Error al buscar películas:", error);
        }
    });
});
