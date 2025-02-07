package com.pedro.ProyectoTFC.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "album")
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int releaseYear;

    private String artist;

    private String genre;

    private int trackCount;

    private int duration; // Duración en minutos

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

    public Album() {
    }

    public Album(String title, int releaseYear, String artist, String genre, int trackCount, int duration, Double rating, String imageUrl) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.artist = artist;
        this.genre = genre;
        this.trackCount = trackCount;
        this.duration = duration;
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

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public int getTrackCount() {
        return trackCount;
    }

    public void setTrackCount(int trackCount) {
        this.trackCount = trackCount;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
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