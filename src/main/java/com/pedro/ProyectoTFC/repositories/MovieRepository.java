package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findById(Long id);
    List<Movie> findByTitleContaining(String query);
    List<Movie> findByUser(User user);
    List<Movie> findByUserAndStatus(User user, Status status);
    Optional<Movie> findByTitleAndReleaseYearAndDirectorAndUser(String title, int releaseYear, String director, User user);

}