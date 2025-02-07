package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.repositories.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {
    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // Obtener todas las películas
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // Obtener película por ID
    public Movie getMovieById(Long id) {
        return movieRepository.findById(id).orElse(null);
    }

    // Guardar una nueva película o actualizar una existente
    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    // Eliminar película por ID
    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    // Actualizar una película existente
    public Movie updateMovie(Long id, Movie updatedMovie) {
        Optional<Movie> movieOptional = movieRepository.findById(id);
        if (movieOptional.isPresent()) {
            Movie movie = movieOptional.get();
            movie.setTitle(updatedMovie.getTitle());
            movie.setReleaseYear(updatedMovie.getReleaseYear());
            movie.setDirector(updatedMovie.getDirector());
            movie.setGenre(updatedMovie.getGenre());
            movie.setRating(updatedMovie.getRating());
            movie.setImageUrl(updatedMovie.getImageUrl());
            return movieRepository.save(movie);
        } else {
            throw new RuntimeException("Movie not found with ID: " + id);
        }
    }
}
