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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Deshabilita CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/**").permitAll() // Permite sin autenticación
                        .anyRequest().authenticated()  // Requiere autenticación para el resto
                )
                .httpBasic(httpBasic -> {}); // Usa autenticación básica

        return http.build();
    }
}
