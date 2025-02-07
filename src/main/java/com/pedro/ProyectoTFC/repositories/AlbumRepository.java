package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
}
