package com.pedro.ProyectoTFC.controllers;

import com.pedro.ProyectoTFC.entities.User;
import com.pedro.ProyectoTFC.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        if (!payload.containsKey("username") || !payload.containsKey("email") || !payload.containsKey("password")) {
            return ResponseEntity.badRequest().body("Todos los campos son obligatorios");
        }

        try {
            User user = userService.registerUser(payload.get("username"), payload.get("email"), payload.get("password"));
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        Optional<User> user = userService.authenticate(payload.get("username"), payload.get("password"));
        if (user.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login exitoso");
            response.put("username", user.get().getUsername());
            response.put("email", user.get().getEmail());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }

}
