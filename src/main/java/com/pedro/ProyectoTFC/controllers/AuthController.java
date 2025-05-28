package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;

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
        String passwordError = userService.getPasswordError(user.getPassword());
        if (!userService.isValidEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de email no válido"));
        }
        if (passwordError != null) {
            return ResponseEntity.badRequest().body(Map.of("error", passwordError));
        }
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData, HttpSession session) {
        String usernameOrEmail = loginData.get("usernameOrEmail");
        String password = loginData.get("password");

        Optional<User> userOpt = userService.findByUsernameOrEmail(usernameOrEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuario o email incorrecto"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Contraseña incorrecta"));
        }

        // Guardar solo el ID del usuario en sesión por seguridad
        session.setAttribute("userId", user.getId());

        // Crear respuesta simplificada sin datos sensibles
        Map<String, Object> response = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().body(Map.of("message", "Sesión cerrada correctamente"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No estás logueado"));
        }
        return ResponseEntity.ok(user);
    }
}
