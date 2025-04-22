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
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Error al registrar usuario: " + e.getMessage())
            );
        }
    }
}