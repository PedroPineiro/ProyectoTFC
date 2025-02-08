package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
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

    public List<Movie> getAllMoviesByUser(User user) {
        return movieRepository.findByUser(user);
    }

    public List<Movie> getMoviesByUserAndStatus(User user, Status status) {
        return movieRepository.findByUserAndStatus(user, status);
    }

    public List<Movie> getFavoriteMoviesByUser(User user) {
        return movieRepository.findByUserAndIsFavoriteTrue(user);
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }
}
