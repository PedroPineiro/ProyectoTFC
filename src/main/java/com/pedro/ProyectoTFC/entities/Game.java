package com.pedro.ProyectoTFC.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "game")
@Getter
@Setter
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int releaseYear;

    private String developer;

    private String genre;

    @Column(nullable = true) // Puede ser null si aún no ha sido calificada
    private Double rating;

    @Column(nullable = true) // Opcional por si no tiene imagen
    private String imageUrl;

    // Validación en el setter para asegurarnos de que solo se usen valores permitidos
    public void setRating(double rating) {
        List<Double> allowedRatings = List.of(0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0);
        if (!allowedRatings.contains(rating)) {
            throw new IllegalArgumentException("El rating debe ser 0, 0.5, 1, 1.5, ..., 5.0");
        }
        this.rating = rating;
    }
}