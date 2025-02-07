package com.pedro.ProyectoTFC.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)  // Desactiva CSRF (solo para desarrollo)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Permite acceso sin autenticación
                );

        return http.build();
    }
}
