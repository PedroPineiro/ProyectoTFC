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

    //Getter, Setter y Constructor

    public User() {
    }

    public User(String username, String email, String password, String profilePicture, String bio, List<Movie> watchedMovies, List<Movie> wishlistMovies, List<Movie> favoriteMovies, List<Game> playedGames, List<Game> wishlistGames, List<Game> favoriteGames, List<Album> listenedAlbums, List<Album> wishlistAlbums, List<Album> favoriteAlbums, List<User> followers, List<User> following) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.profilePicture = profilePicture;
        this.bio = bio;
        this.watchedMovies = watchedMovies;
        this.wishlistMovies = wishlistMovies;
        this.favoriteMovies = favoriteMovies;
        this.playedGames = playedGames;
        this.wishlistGames = wishlistGames;
        this.favoriteGames = favoriteGames;
        this.listenedAlbums = listenedAlbums;
        this.wishlistAlbums = wishlistAlbums;
        this.favoriteAlbums = favoriteAlbums;
        this.followers = followers;
        this.following = following;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<Movie> getWatchedMovies() {
        return watchedMovies;
    }

    public void setWatchedMovies(List<Movie> watchedMovies) {
        this.watchedMovies = watchedMovies;
    }

    public List<Movie> getWishlistMovies() {
        return wishlistMovies;
    }

    public void setWishlistMovies(List<Movie> wishlistMovies) {
        this.wishlistMovies = wishlistMovies;
    }

    public List<Movie> getFavoriteMovies() {
        return favoriteMovies;
    }

    public void setFavoriteMovies(List<Movie> favoriteMovies) {
        this.favoriteMovies = favoriteMovies;
    }

    public List<Game> getPlayedGames() {
        return playedGames;
    }

    public void setPlayedGames(List<Game> playedGames) {
        this.playedGames = playedGames;
    }

    public List<Game> getWishlistGames() {
        return wishlistGames;
    }

    public void setWishlistGames(List<Game> wishlistGames) {
        this.wishlistGames = wishlistGames;
    }

    public List<Game> getFavoriteGames() {
        return favoriteGames;
    }

    public void setFavoriteGames(List<Game> favoriteGames) {
        this.favoriteGames = favoriteGames;
    }

    public List<Album> getListenedAlbums() {
        return listenedAlbums;
    }

    public void setListenedAlbums(List<Album> listenedAlbums) {
        this.listenedAlbums = listenedAlbums;
    }

    public List<Album> getWishlistAlbums() {
        return wishlistAlbums;
    }

    public void setWishlistAlbums(List<Album> wishlistAlbums) {
        this.wishlistAlbums = wishlistAlbums;
    }

    public List<Album> getFavoriteAlbums() {
        return favoriteAlbums;
    }

    public void setFavoriteAlbums(List<Album> favoriteAlbums) {
        this.favoriteAlbums = favoriteAlbums;
    }

    public List<User> getFollowers() {
        return followers;
    }

    public void setFollowers(List<User> followers) {
        this.followers = followers;
    }

    public List<User> getFollowing() {
        return following;
    }

    public void setFollowing(List<User> following) {
        this.following = following;
    }
}
