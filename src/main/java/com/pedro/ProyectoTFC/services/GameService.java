package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.clients.RAWGClient;
import com.pedro.ProyectoTFC.entities.Game;
import com.pedro.ProyectoTFC.repositories.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final RAWGClient rawgClient;

    public GameService(GameRepository gameRepository, RAWGClient rawgClient) {
        this.gameRepository = gameRepository;
        this.rawgClient = rawgClient;
    }

    // Obtener todos los juegos
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    // Obtener juego por ID
    public Game getGameById(Long id) {
        return gameRepository.findById(id).orElse(null);
    }

    // Guardar un nuevo juego o actualizar uno existente
    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }

    // Eliminar juego por ID
    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }

    // Actualizar un juego existente
    public Game updateGame(Long id, Game updatedGame) {
        Optional<Game> gameOptional = gameRepository.findById(id);
        if (gameOptional.isPresent()) {
            Game game = gameOptional.get();
            game.setTitle(updatedGame.getTitle());
            game.setReleaseYear(updatedGame.getReleaseYear());
            game.setDeveloper(updatedGame.getDeveloper());
            game.setGenre(updatedGame.getGenre());
            game.setRating(updatedGame.getRating());
            game.setImageUrl(updatedGame.getImageUrl());
            return gameRepository.save(game);
        } else {
            throw new RuntimeException("Game not found with ID: " + id);
        }
    }

    // Buscar juego en RAWG
    public String searchGameInRAWG(String query) {
        return rawgClient.searchGame(query);
    }
}
