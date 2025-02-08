package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.Movie;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByUser(User user);
    List<Movie> findByUserAndStatus(User user, Status status);
    List<Movie> findByUserAndIsFavoriteTrue(User user);
}
