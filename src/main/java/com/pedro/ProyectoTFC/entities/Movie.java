package com.pedro.ProyectoTFC.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.pedro.ProyectoTFC.entities.enums.Status;
import jakarta.persistence.*;

import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @ElementCollection
    @CollectionTable(name = "movie_actors", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "actor")
    private List<String> actors;

    @ElementCollection
    @CollectionTable(name = "movie_genres", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "genre")
    private List<String> genre;

    private Double globalRating;

    private Double userRating;

    private Integer duration;

    private String imageUrl;

    private LocalDateTime addedDate = LocalDateTime.now(); // Se auto-guarda al crear

    private LocalDate watchedDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    private boolean isFavorite; // true si es favorito, false si no

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference  // Indica que esta es la parte inversa de la relación
    private User user;


    public Movie() {
    }

    public Movie(Long id, String title, int releaseYear, String director, List<String> actors, List<String> genre, Double globalRating, Double userRating, Integer duration, String imageUrl, LocalDateTime addedDate, LocalDate watchedDate, Status status, boolean isFavorite, User user) {
        this.id = id;
        this.title = title;
        this.releaseYear = releaseYear;
        this.director = director;
        this.actors = actors;
        this.genre = genre;
        this.globalRating = globalRating;
        this.userRating = userRating;
        this.duration = duration;
        this.imageUrl = imageUrl;
        this.addedDate = addedDate;
        this.watchedDate = watchedDate;
        this.status = status;
        this.isFavorite = isFavorite;
        this.user = user;
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

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public List<String> getActors() {
        return actors;
    }

    public void setActors(List<String> actors) {
        this.actors = actors;
    }

    public List<String> getGenre() {
        return genre;
    }

    public void setGenre(List<String> genre) {
        this.genre = genre;
    }

    public Double getGlobalRating() {
        return globalRating;
    }

    public void setGlobalRating(Double rating) {
        this.globalRating = rating;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDateTime addedDate) {
        this.addedDate = addedDate;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
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

    public Double getUserRating() {
        return userRating;
    }

    public void setUserRating(Double userRating) {
        this.userRating = userRating;
    }

    public LocalDate getWatchedDate() {
        return watchedDate;
    }

    public void setWatchedDate(LocalDate watchedDate) {
        this.watchedDate = watchedDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}