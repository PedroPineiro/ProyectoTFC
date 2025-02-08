package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.Game;
import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.entities.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByUser(User user);
    List<Game> findByUserAndStatus(User user, Status status);
    List<Game> findByUserAndIsFavoriteTrue(User user);
}
