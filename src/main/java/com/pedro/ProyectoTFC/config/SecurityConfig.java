package com.pedro.ProyectoTFC.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // Encripta las contraseñas de los usuarios
    /*
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
     */

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Deshabilita CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/**").permitAll()  // Permite usuarios sin autenticación
                        .requestMatchers("/api/movies/**").permitAll() // Permite acceso a la API de películas
                        .anyRequest().authenticated()  // Protege el resto
                )
                .httpBasic(httpBasic -> {}); // Usa autenticación básica

        return http.build();
    }

}
