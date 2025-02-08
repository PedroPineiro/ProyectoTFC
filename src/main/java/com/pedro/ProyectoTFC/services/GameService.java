package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.entities.Game;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import com.pedro.ProyectoTFC.repositories.GameRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<Game> getAllGamesByUser(User user) {
        return gameRepository.findByUser(user);
    }

    public List<Game> getGamesByUserAndStatus(User user, Status status) {
        return gameRepository.findByUserAndStatus(user, status);
    }

    public List<Game> getFavoriteGamesByUser(User user) {
        return gameRepository.findByUserAndIsFavoriteTrue(user);
    }

    public Optional<Game> getGameById(Long id) {
        return gameRepository.findById(id);
    }

    public Game saveGame(Game game) {
        return gameRepository.save(game);
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }
}
