package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import com.pedro.ProyectoTFC.services.MovieService;
import com.pedro.ProyectoTFC.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/movies")
public class MovieController {
    private final MovieService movieService;
    private final UserService userService; // Para obtener el usuario

    public MovieController(MovieService movieService, UserService userService) {
        this.movieService = movieService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Movie>> getMoviesByUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(value -> ResponseEntity.ok(movieService.getAllMoviesByUser(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}/status/{status}")
    public ResponseEntity<List<Movie>> getMoviesByStatus(@PathVariable Long userId, @PathVariable Status status) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(value -> ResponseEntity.ok(movieService.getMoviesByUserAndStatus(value, status)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Movie> addMovie(@PathVariable Long userId, @RequestBody Movie movie) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            movie.setUser(user.get());
            return ResponseEntity.ok(movieService.saveMovie(movie));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}
