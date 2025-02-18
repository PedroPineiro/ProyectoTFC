package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.clients.TMDBClient;
import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import com.pedro.ProyectoTFC.repositories.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final TMDBClient tmdbClient;

    public MovieService(MovieRepository movieRepository, TMDBClient tmdbClient) {
        this.movieRepository = movieRepository;
        this.tmdbClient = tmdbClient;
    }

    public List<Movie> searchMovies(String query) {
        // Implementa la lógica de búsqueda de películas en la base de datos
        return movieRepository.findByTitleContaining(query);
    }

    public String searchMoviesInTMDB(String query) {
        // Llama al cliente TMDB para buscar películas
        return tmdbClient.searchMovie(query);
    }

    public List<Movie> getAllMoviesByUser(User user) {
        return movieRepository.findByUser(user);
    }

    public List<Movie> getMoviesByUserAndStatus(User user, Status status) {
        return movieRepository.findByUserAndStatus(user, status);
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new RuntimeException("La película no existe");
        }
        movieRepository.deleteById(id);
    }

}