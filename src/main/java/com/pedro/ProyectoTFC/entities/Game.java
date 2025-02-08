package com.pedro.ProyectoTFC.entities;

import com.pedro.ProyectoTFC.entities.enums.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private int releaseYear;

    private String developer;

    private String genre;

    @Column(nullable = true) // Puede ser null si no se ha calificado
    private Double rating;

    @Column(nullable = true) // Opcional si no tiene imagen
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Status status;

    private boolean isFavorite; // true si es favorito, false si no

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Game() {
    }

    public Game(String title, int releaseYear, String developer, String genre, Double rating, String imageUrl, Status status, boolean isFavorite, User user) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.developer = developer;
        this.genre = genre;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.status = status;
        this.isFavorite = isFavorite;
        this.user = user;
    }

    public Long getId() {
        return id;
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
