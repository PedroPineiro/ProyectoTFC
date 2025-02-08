package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.Album;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByUser(User user);
    List<Album> findByUserAndStatus(User user, Status status);
    List<Album> findByUserAndIsFavoriteTrue(User user);
}
