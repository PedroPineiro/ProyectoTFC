package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByUser(User user, Sort sort); // <-- Usado para cuando status es null
    List<Movie> findByTitleContaining(String query); // No directamente relacionado con este issue
    List<Movie> findByUser(User user); // Podría ser redundante si findByUser(User user, Sort sort) es el principal
    List<Movie> findByUserAndStatus(User user, Status status); // Podría ser redundante si findByUserAndStatus(User user, Status status, Sort sort) es el principal
    Optional<Movie> findByTitleAndReleaseYearAndDirectorAndUser(String title, int releaseYear, String director, User user);
    List<Movie> findByUserAndStatus(User user, Status status, Sort sort); // <-- Usado para cuando status no es null
}