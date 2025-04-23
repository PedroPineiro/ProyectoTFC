package com.pedro.ProyectoTFC.services;

import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        // Verificar si el nombre de usuario ya está en uso
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        // Verificar si el correo electrónico ya está en uso
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("El correo electrónico ya está en uso");
        }

        // Si no hay problemas, codificamos la contraseña y guardamos el usuario
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Buscar por nombre de usuario
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Buscar por correo electrónico
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Metodo combinado para encontrar por username o email
    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        Optional<User> user = findByUsername(usernameOrEmail);
        if (user.isPresent()) {
            return user;
        }
        return findByEmail(usernameOrEmail);
    }

    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }
}
