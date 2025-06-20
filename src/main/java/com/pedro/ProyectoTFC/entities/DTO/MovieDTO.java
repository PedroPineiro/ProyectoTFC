package com.pedro.ProyectoTFC.entities.DTO;

import com.pedro.ProyectoTFC.entities.enums.Status;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MovieDTO {
    private String title;
    private int releaseYear;
    private String director;
    private List<String> actors;
    private List<String> genre;
    private Double globalRating;
    private String imageUrl;
    private LocalDateTime addedDate;
    private String description;
    private double userRating;
    private Integer duration;
    private LocalDate watchedDate;
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
    public List<String> getGenre() { return genre; }
    public void setGenre(List<String> genre) { this.genre = genre; }
    public List<String> getActors() { return actors; }
    public void setActors(List<String> actors) { this.actors = actors; }
    public Double getGlobalRating() { return globalRating; }
    public void setGlobalRating(Double globalRating) { this.globalRating = globalRating; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public LocalDateTime getAddedDate() { return addedDate; }
    public void setAddedDate(LocalDateTime addedDate) { this.addedDate = addedDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getUserRating() { return userRating; }
    public void setUserRating(double userRating) { this.userRating = userRating; }
    public LocalDate getWatchedDate() { return watchedDate; }
    public void setWatchedDate(LocalDate watchedDate) { this.watchedDate = watchedDate; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public boolean isFavorite() { return isFavorite; }
    public void setFavorite(boolean favorite) { isFavorite = favorite; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}