package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.Game;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import com.pedro.ProyectoTFC.services.GameService;
import com.pedro.ProyectoTFC.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;
    private final UserService userService;

    public GameController(GameService gameService, UserService userService) {
        this.gameService = gameService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Game>> getGamesByUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(value -> ResponseEntity.ok(gameService.getAllGamesByUser(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Game> addGame(@PathVariable Long userId, @RequestBody Game game) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            game.setUser(user.get());
            return ResponseEntity.ok(gameService.saveGame(game));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }
}
