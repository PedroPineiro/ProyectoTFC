package com.pedro.ProyectoTFC.repositories;

import com.pedro.ProyectoTFC.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);  // Buscar usuario por nombre
    Optional<User> findByEmail(String email);        // Buscar usuario por email
}