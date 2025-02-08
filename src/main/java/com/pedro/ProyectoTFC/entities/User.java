package com.pedro.ProyectoTFC.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String username;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String profilePicture; // URL de la foto de perfil
    private String bio; // Biografía del usuario

    @ManyToMany
    @JoinTable(name = "user_watched_movies")
    @JsonIgnore
    private List<Movie> watchedMovies = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_wishlist_movies")
    @JsonIgnore
    private List<Movie> wishlistMovies = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_favorite_movies")
    @JsonIgnore
    private List<Movie> favoriteMovies = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_played_games")
    @JsonIgnore
    private List<Game> playedGames = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_wishlist_games")
    @JsonIgnore
    private List<Game> wishlistGames = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_favorite_games")
    @JsonIgnore
    private List<Game> favoriteGames = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_listened_albums")
    @JsonIgnore
    private List<Album> listenedAlbums = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_wishlist_albums")
    @JsonIgnore
    private List<Album> wishlistAlbums = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "user_favorite_albums")
    @JsonIgnore
    private List<Album> favoriteAlbums = new ArrayList<>();

    // Relaciones de seguidores/seguidos
    @ManyToMany
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    @JsonIgnore
    private List<User> followers = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @JsonIgnore
    private List<User> following = new ArrayList<>();
}
