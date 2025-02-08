package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.entities.Album;
import com.pedro.ProyectoTFC.entities.Game;
import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.repositories.AlbumRepository;
import com.pedro.ProyectoTFC.repositories.GameRepository;
import com.pedro.ProyectoTFC.repositories.MovieRepository;
import com.pedro.ProyectoTFC.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final GameRepository gameRepository;
    private final AlbumRepository albumRepository;

    public UserService(UserRepository userRepository, MovieRepository movieRepository,
                       GameRepository gameRepository, AlbumRepository albumRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.gameRepository = gameRepository;
        this.albumRepository = albumRepository;
    }

    public void addMovieToUser(Long userId, Long movieId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new RuntimeException("Película no encontrada"));

        user.getMovies().add(movie);
        userRepository.save(user);
    }

    public void removeMovieFromUser(Long userId, Long movieId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.getMovies().removeIf(movie -> movie.getId().equals(movieId));
        userRepository.save(user);
    }

    public void addGameToUser(Long userId, Long gameId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Juego no encontrado"));

        user.getGames().add(game);
        userRepository.save(user);
    }

    public void removeGameFromUser(Long userId, Long gameId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.getGames().removeIf(game -> game.getId().equals(gameId));
        userRepository.save(user);
    }

    public void addAlbumToUser(Long userId, Long albumId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Album album = albumRepository.findById(albumId).orElseThrow(() -> new RuntimeException("Álbum no encontrado"));

        user.getAlbums().add(album);
        userRepository.save(user);
    }

    public void removeAlbumFromUser(Long userId, Long albumId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.getAlbums().removeIf(album -> album.getId().equals(albumId));
        userRepository.save(user);
    }
}
