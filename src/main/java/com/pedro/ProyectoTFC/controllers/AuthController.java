package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder; // Import PasswordEncoder

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")  //  Allow requests from ANY origin (for testing)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String usernameOrEmail = loginData.get("usernameOrEmail");
        String password = loginData.get("password");

        // Buscar usuario por username o email usando el método combinado
        Optional<User> userOpt = userService.findByUsernameOrEmail(usernameOrEmail);

        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuario o email incorrecto"));
        }

        User user = userOpt.get();

        // Verificar la contraseña
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Contraseña incorrecta"));
        }

        // Si todo es correcto, devolver el usuario
        return ResponseEntity.ok(user);
    }
}
