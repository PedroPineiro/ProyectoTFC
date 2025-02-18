package com.pedro.ProyectoTFC.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.pedro.ProyectoTFC.entities.enums.Status;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int releaseYear;

    private String director;

    private String genre;

    @Column(nullable = true) // Puede ser null si aún no ha sido calificada
    private Double rating;

    @Column(nullable = true) // Opcional por si no tiene imagen
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Status status;

    private boolean isFavorite; // true si es favorito, false si no

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference  // Indica que esta es la parte inversa de la relación
    private User user;


    public Movie() {
    }

    public Movie(String title, int releaseYear, String director, String genre, Double rating, String imageUrl, Status status, boolean isFavorite, User user) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.director = director;
        this.genre = genre;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.status = status;
        this.isFavorite = isFavorite;
        this.user = user;
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

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
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

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean isFavorite() {
        return isFavorite;
    }

    public void setFavorite(boolean favorite) {
        isFavorite = favorite;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}