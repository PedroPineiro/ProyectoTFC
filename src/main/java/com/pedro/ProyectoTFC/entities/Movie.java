package com.pedro.ProyectoTFC.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "movie")
@Getter
@Setter
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int releaseYear;

    private String director;

    private String genre;

    @Min(0)
    @Max(5)
    @Column(precision = 2, scale = 1) // Asegura que solo tenga un decimal (0.0, 0.5, ..., 5.0)
    private double rating;

    private String imageUrl;
}