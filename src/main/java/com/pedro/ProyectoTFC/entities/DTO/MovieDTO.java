package com.pedro.ProyectoTFC.entities.DTO;

import com.pedro.ProyectoTFC.entities.enums.Status;

public class MovieDTO {
    private String title;
    private int releaseYear;
    private String director;
    private String genre;
    private Double rating;
    private String imageUrl;
    private Status status;
    private boolean isFavorite;
    private Long userId;

    // Getters y Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public int getReleaseYear() { return releaseYear; }
    public void setReleaseYear(int releaseYear) { this.releaseYear = releaseYear; }
    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public boolean isFavorite() { return isFavorite; }
    public void setFavorite(boolean favorite) { isFavorite = favorite; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}