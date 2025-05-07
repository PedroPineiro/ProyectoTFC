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

    @GetMapping("/search")
    public ResponseEntity<String> searchMoviesInTMDB(@RequestParam String query) {
        String result = movieService.searchMoviesInTMDB(query);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addMovie(@RequestBody MovieDTO movieDTO) {
        try {
            Optional<User> user = userService.findUserById(movieDTO.getUserId());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }

            // Verificar si la película ya existe para el usuario
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
            movie.setGenre(movieDTO.getGenre());
            movie.setGlobalRating(movieDTO.getGlobalRating());
            movie.setImageUrl(movieDTO.getImageUrl());
            movie.setStatus(movieDTO.getStatus());
            movie.setFavorite(movieDTO.isFavorite());
            movie.setUser(user.get());

            try{
                if(movieDTO.getStatus() == Status.PLAYED){
                    movie.setUserRating(movieDTO.getUserRating());
                    movieService.isUserRatingValid(movieDTO.getUserRating());
                    movie.setWatchedDate(movieDTO.getWatchedDate());
                }
            }
            catch (Exception e){
                return ResponseEntity.badRequest().body("UserRating no valido: " + e.getMessage());
            }

            Movie savedMovie = movieService.saveMovie(movie);
            return ResponseEntity.ok(savedMovie);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar la película: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Movie>> getMoviesByUserAndStatus(@PathVariable Long userId, @RequestParam(required = false) String status) {
        Optional<User> user = userService.findUserById(userId);
        if (user.isPresent()) {
            List<Movie> movies = movieService.getAllMoviesByUser(user.get());
            if (status != null && !status.isEmpty()) {
                Status searchStatus = Status.valueOf(status.toUpperCase());
                movies = movies.stream()
                        .filter(movie -> movie.getStatus() == searchStatus)
                        .collect(Collectors.toList());
            }
            return ResponseEntity.ok(movies);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/my-movies")
    public ResponseEntity<?> getCurrentUserMovies(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No estás logueado"));
        }

        Optional<User> user = userService.findUserById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuario no encontrado"));
        }

        List<Movie> movies = movieService.getAllMoviesByUser(user.get());
        return ResponseEntity.ok(movies);
    }
}
