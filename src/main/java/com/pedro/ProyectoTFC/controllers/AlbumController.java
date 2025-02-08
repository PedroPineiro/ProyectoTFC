package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.Album;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import com.pedro.ProyectoTFC.services.AlbumService;
import com.pedro.ProyectoTFC.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/albums")
public class AlbumController {
    private final AlbumService albumService;
    private final UserService userService;

    public AlbumController(AlbumService albumService, UserService userService) {
        this.albumService = albumService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Album>> getAlbumsByUser(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(value -> ResponseEntity.ok(albumService.getAllAlbumsByUser(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Album> addAlbum(@PathVariable Long userId, @RequestBody Album album) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            album.setUser(user.get());
            return ResponseEntity.ok(albumService.saveAlbum(album));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }
}
