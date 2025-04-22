package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.services.MovieService;
import com.pedro.ProyectoTFC.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/movies")  // Ahora todos los endpoints de películas comienzan con /api/movies
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

//    @PostMapping("/add")
//    public ResponseEntity<?> addMovie(@RequestBody Movie movie, @RequestParam Long userId) {
//        Optional<User> user = userService.findUserById(userId);
//        if (user.isPresent()) {
//            movie.setUser(user.get());
//            Movie savedMovie = movieService.saveMovie(movie);
//            return ResponseEntity.ok(savedMovie);
//        }
//        return ResponseEntity.badRequest().body("Usuario no encontrado");
//    }

}
