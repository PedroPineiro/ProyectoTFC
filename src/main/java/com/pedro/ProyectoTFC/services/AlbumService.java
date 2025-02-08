package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.entities.Album;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
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

    public List<Album> getAllAlbumsByUser(User user) {
        return albumRepository.findByUser(user);
    }

    public List<Album> getAlbumsByUserAndStatus(User user, Status status) {
        return albumRepository.findByUserAndStatus(user, status);
    }

    public List<Album> getFavoriteAlbumsByUser(User user) {
        return albumRepository.findByUserAndIsFavoriteTrue(user);
    }

    public Optional<Album> getAlbumById(Long id) {
        return albumRepository.findById(id);
    }

    public Album saveAlbum(Album album) {
        return albumRepository.save(album);
    }

    public void deleteAlbum(Long id) {
        albumRepository.deleteById(id);
    }
}
