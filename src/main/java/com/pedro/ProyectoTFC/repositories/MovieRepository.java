package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByTitleContaining(String query);
    List<Movie> findByUser(User user);
    List<Movie> findByUserAndStatus(User user, Status status);
}