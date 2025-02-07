package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.Album;
import com.pedro.ProyectoTFC.services.AlbumService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/albums")
public class AlbumController {
    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    // Obtener todos los álbumes
    @GetMapping
    public List<Album> getAllAlbums() {
        return albumService.getAllAlbums();
    }

    // Obtener un álbum por ID
    @GetMapping("/{id}")
    public Album getAlbumById(@PathVariable Long id) {
        return albumService.getAlbumById(id);
    }

    // Crear un nuevo álbum
    @PostMapping
    public Album createAlbum(@RequestBody Album album) {
        return albumService.saveAlbum(album);
    }

    // Actualizar un álbum existente
    @PutMapping("/{id}")
    public Album updateAlbum(@PathVariable Long id, @RequestBody Album updatedAlbum) {
        return albumService.updateAlbum(id, updatedAlbum);
    }

    // Eliminar un álbum
    @DeleteMapping("/{id}")
    public void deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);
    }

    @GetMapping("/search")
    public String searchAlbum(@RequestParam String artist, @RequestParam String album) {
        return albumService.searchAlbumInLastFM(artist, album);
    }
}
