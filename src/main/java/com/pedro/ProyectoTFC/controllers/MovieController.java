package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.DTO.MovieDTO;
import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import com.pedro.ProyectoTFC.services.MovieService;
import com.pedro.ProyectoTFC.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieService movieService;
    private final UserService userService;

    public MovieController(MovieService movieService, UserService userService) {
        this.movieService = movieService;
        this.userService = userService;
    }

    // Buscar películas en TMDB
    @GetMapping("/search")
    public ResponseEntity<String> searchMoviesInTMDB(@RequestParam String query) {
        String result = movieService.searchMoviesInTMDB(query);
        return ResponseEntity.ok(result);
    }

    // Agregar una película a la biblioteca del usuario
    @PostMapping("/add")
    public ResponseEntity<?> addMovie(@RequestBody MovieDTO movieDTO) {
        try {
            Optional<User> user = userService.findUserById(movieDTO.getUserId());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }

            Optional<Movie> existingMovie = movieService.findMovieByDetailsAndUser(
                    movieDTO.getTitle(),
                    movieDTO.getReleaseYear(),
                    movieDTO.getDirector(),
                    user.get()
            );

            if (existingMovie.isPresent()) {
                return ResponseEntity.badRequest().body("Esta película ya está en tu biblioteca");
            }

            Movie movie = new Movie();
            movie.setTitle(movieDTO.getTitle());
            movie.setReleaseYear(movieDTO.getReleaseYear());
            movie.setDirector(movieDTO.getDirector());
            movie.setActors(movieDTO.getActors());
            movie.setGenre(movieDTO.getGenre());
            movie.setGlobalRating(movieDTO.getGlobalRating());
            movie.setImageUrl(movieDTO.getImageUrl());
            movie.setAddedDate(LocalDateTime.now()); // Establece la fecha actual
            movie.setLastModifiedDate(LocalDateTime.now());
            movie.setStatus(movieDTO.getStatus());
            movie.setFavorite(movieDTO.isFavorite());
            movie.setUser(user.get());

            if(movieDTO.getStatus() == Status.PLAYED){
                movie.setUserRating(movieDTO.getUserRating());
                movieService.isUserRatingValid(movieDTO.getUserRating());
                movie.setWatchedDate(movieDTO.getWatchedDate());
            }

            Movie savedMovie = movieService.saveMovie(movie);
            return ResponseEntity.ok(savedMovie);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar la película: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Movie>> getMoviesByUserAndStatus(
            @PathVariable Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "addedDate") String sortBy, // Cambiado a addedDate por defecto
            @RequestParam(required = false, defaultValue = "desc") String sortDirection) { // Cambiado a desc para ver primero las recientes

        // Lista de campos por los que se puede ordenar
        List<String> validSortFields = Arrays.asList("addedDate", "title", "releaseYear", "userRating");

        if (!validSortFields.contains(sortBy)) {
            return ResponseEntity.badRequest().body(null);
        }

        Optional<User> user = userService.findUserById(userId);
        if (user.isPresent()) {
            Status searchStatus = null;
            if (status != null && !status.isEmpty()) {
                try {
                    searchStatus = Status.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(null);
                }
            }
            List<Movie> movies = movieService.getMoviesByUserAndStatusAndSort(user.get(), searchStatus, sortBy, sortDirection);
            return ResponseEntity.ok(movies);
        }
        return ResponseEntity.notFound().build();
    }

    // Aactualizar el status de la pelicula PLAYED o WISHLIST
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateMovieStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            Optional<Movie> movieOptional = movieService.findMovieById(id);

            if (movieOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Película no encontrada");
            }

            Movie movie = movieOptional.get();
            movie.setStatus(Status.valueOf(newStatus.toUpperCase()));
            movieService.saveMovie(movie);

            return ResponseEntity.ok(movie);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el estado: " + e.getMessage());
        }
    }

    // Eliminar la pelicula de la base de datos del usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        try {
            movieService.deleteMovie(id);
            return ResponseEntity.ok("Película eliminada con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al eliminar la película: " + e.getMessage());
        }
    }
}
