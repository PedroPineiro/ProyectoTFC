package com.pedro.ProyectoTFC.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "game")
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

    public Game(String title, int releaseYear, String developer, String genre, Double rating, String imageUrl) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.developer = developer;
        this.genre = genre;
        this.rating = rating;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getDeveloper() {
        return developer;
    }

    public void setDeveloper(String developer) {
        this.developer = developer;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

