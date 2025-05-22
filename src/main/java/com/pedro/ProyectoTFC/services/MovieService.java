package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.clients.TMDBClient;
import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import com.pedro.ProyectoTFC.repositories.MovieRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public List<Movie> getMoviesByUserAndStatusAndSort(User user, Status status, String sortBy, String sortDirection) {
        Sort.Direction direction = Sort.Direction.ASC; // Por defecto ascendente

        if (sortDirection != null && sortDirection.equalsIgnoreCase("desc")) {
            direction = Sort.Direction.DESC;
        }

        Sort sort;
        // ¡Importante! Los nombres de los campos deben coincidir exactamente con los atributos de tu entidad Movie
        switch (sortBy) {
            case "releaseYear":
                sort = Sort.by(direction, "releaseYear");
                break;
            case "title":
                sort = Sort.by(direction, "title");
                break;
            case "globalRating": // Asumiendo que Movie tiene un campo 'globalRating'
                sort = Sort.by(direction, "globalRating");
                break;
            case "userRating": // Asumiendo que Movie tiene un campo 'userRating'
                sort = Sort.by(direction, "userRating");
                break;
            case "genre":
                sort = Sort.by(direction, "genre");
                break;
            default:
                // Por defecto, ordenar por título si el campo de ordenación no es reconocido
                sort = Sort.by(direction, "title");
                break;
        }

        if (status != null) {
            return movieRepository.findByUserAndStatus(user, status, sort);
        } else {
            return movieRepository.findByUser(user, sort);
        }
    }


    public boolean isUserRatingValid(Double userRating) {
        return userRating >= 0 && userRating <= 5 && (userRating * 10) % 5 == 0;
    }

    public Optional<Movie> findMovieByDetailsAndUser(String title, int releaseYear, String director, User user) {
        return movieRepository.findByTitleAndReleaseYearAndDirectorAndUser(title, releaseYear, director, user);
    }

    public Optional<Movie> findMovieById(Long id) {
        return movieRepository.findById(id);
    }

}