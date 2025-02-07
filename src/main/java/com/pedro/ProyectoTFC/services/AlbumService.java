package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.entities.Album;
import com.pedro.ProyectoTFC.repositories.AlbumRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlbumService {
    private final AlbumRepository albumRepository;

    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    // Obtener todos los álbumes
    public List<Album> getAllAlbums() {
        return albumRepository.findAll();
    }

    // Obtener un álbum por ID
    public Album getAlbumById(Long id) {
        return albumRepository.findById(id).orElse(null);
    }

    // Guardar un nuevo álbum
    public Album saveAlbum(Album album) {
        return albumRepository.save(album);
    }

    // Eliminar un álbum por ID
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
            album.setTrackCount(updatedAlbum.getTrackCount());
            album.setDuration(updatedAlbum.getDuration());
            album.setRating(updatedAlbum.getRating());
            album.setImageUrl(updatedAlbum.getImageUrl());
            return albumRepository.save(album);
        } else {
            throw new RuntimeException("Album not found with ID: " + id);
        }
    }
}
