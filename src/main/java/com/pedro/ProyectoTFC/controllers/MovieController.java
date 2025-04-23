package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.DTO.MovieDTO;
import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.services.MovieService;
import com.pedro.ProyectoTFC.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

            Movie movie = new Movie();
            movie.setTitle(movieDTO.getTitle());
            movie.setReleaseYear(movieDTO.getReleaseYear());
            movie.setDirector(movieDTO.getDirector());
            movie.setGenre(movieDTO.getGenre());
            movie.setRating(movieDTO.getRating());
            movie.setImageUrl(movieDTO.getImageUrl());
            movie.setStatus(movieDTO.getStatus());
            movie.setFavorite(movieDTO.isFavorite());
            movie.setUser(user.get());

            Movie savedMovie = movieService.saveMovie(movie);
            return ResponseEntity.ok(savedMovie);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar la película: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Movie>> getMoviesByUser(@PathVariable Long userId) {
        Optional<User> user = userService.findUserById(userId);
        if (user.isPresent()) {
            List<Movie> movies = movieService.getAllMoviesByUser(user.get());
            return ResponseEntity.ok(movies);
        }
        return ResponseEntity.notFound().build();
    }
}
