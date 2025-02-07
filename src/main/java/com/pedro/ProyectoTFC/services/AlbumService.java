package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.clients.LastFMClient;
import com.pedro.ProyectoTFC.entities.Album;
import com.pedro.ProyectoTFC.repositories.AlbumRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final LastFMClient lastFMClient;

    public AlbumService(AlbumRepository albumRepository, LastFMClient lastFMClient) {
        this.albumRepository = albumRepository;
        this.lastFMClient = lastFMClient;
    }

    // Obtener todos los álbumes
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    // Obtener álbum por ID
    public Album getAlbumById(Long id) {
        return albumRepository.findById(id).orElse(null);
    }

    // Guardar un nuevo álbum o actualizar uno existente
    public Album saveAlbum(Album album) {
        return albumRepository.save(album);
    }

    // Eliminar álbum por ID
    public void deleteAlbum(Long id) {
        albumRepository.deleteById(id);
    }

    // Actualizar un álbum existente
    public Album updateAlbum(Long id, Album updatedAlbum) {
        Optional<Album> albumOptional = albumRepository.findById(id);
        if (albumOptional.isPresent()) {
            Album album = albumOptional.get();
            album.setTitle(updatedAlbum.getTitle());
            album.setReleaseYear(updatedAlbum.getReleaseYear());
            album.setArtist(updatedAlbum.getArtist());
            album.setGenre(updatedAlbum.getGenre());
            album.setRating(updatedAlbum.getRating());
            album.setImageUrl(updatedAlbum.getImageUrl());
            return albumRepository.save(album);
        } else {
            throw new RuntimeException("Album not found with ID: " + id);
        }
    }

    // Buscar álbum en LastFM
    public String searchAlbumInLastFM(String artist, String album) {
        return lastFMClient.searchAlbum(artist, album);
    }
}
