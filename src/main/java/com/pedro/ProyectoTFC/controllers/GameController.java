package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.Game;
import com.pedro.ProyectoTFC.services.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    // Obtener todos los juegos
    @GetMapping
    public List<Game> getAllGames() {
        return gameService.getAllGames();
    }

    // Obtener juego por ID
    @GetMapping("/{id}")
    public Game getGameById(@PathVariable Long id) {
        return gameService.getGameById(id);
    }

    // Crear un nuevo juego
    @PostMapping
    public Game createGame(@RequestBody Game game) {
        return gameService.saveGame(game);
    }

    // Actualizar un juego existente
    @PutMapping("/{id}")
    public Game updateGame(@PathVariable Long id, @RequestBody Game updatedGame) {
        return gameService.updateGame(id, updatedGame);
    }

    // Eliminar un juego
    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
    }

    @GetMapping("/search")
    public String searchGame(@RequestParam String query) {
        return gameService.searchGameInRAWG(query);
    }
}
