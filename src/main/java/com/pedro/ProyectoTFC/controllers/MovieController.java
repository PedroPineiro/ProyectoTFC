package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.services.MovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // Obtener todas las películas
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // Obtener película por ID
    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    // Crear una nueva película
    @PostMapping
    public Movie createMovie(@RequestBody Movie movie) {
        return movieService.saveMovie(movie);
    }

    // Actualizar una película existente
    @PutMapping("/{id}")
    public Movie updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        return movieService.updateMovie(id, updatedMovie);
    }

    // Eliminar una película
    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
    }
}
