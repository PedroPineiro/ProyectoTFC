package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
}
