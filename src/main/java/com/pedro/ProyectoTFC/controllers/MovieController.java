package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.services.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")  // Ahora todos los endpoints de películas comienzan con /api/movies
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchMoviesInTMDB(@RequestParam String query) {
        String result = movieService.searchMoviesInTMDB(query);
        return ResponseEntity.ok(result);
    }
}
