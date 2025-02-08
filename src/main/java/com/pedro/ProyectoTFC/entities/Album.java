package com.pedro.ProyectoTFC.entities;

import com.pedro.ProyectoTFC.entities.enums.Status;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "albums")
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

    @Enumerated(EnumType.STRING)
    private Status status;

    private boolean isFavorite; // true si es favorito, false si no

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Album() {
    }

    public Album(String title, int releaseYear, String artist, String genre, int trackCount, int duration, Double rating, String imageUrl, Status status, boolean isFavorite, User user) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.artist = artist;
        this.genre = genre;
        this.trackCount = trackCount;
        this.duration = duration;
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