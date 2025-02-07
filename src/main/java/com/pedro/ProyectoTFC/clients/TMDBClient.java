package com.pedro.ProyectoTFC.clients;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TMDBClient {
    private static final String API_KEY = "998d343674fbacfea441d0e40df4f0ea";
    private static final String BASE_URL = "https://api.themoviedb.org/3";

    private final RestTemplate restTemplate = new RestTemplate();

    public String searchMovie(String query) {
        String url = BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + query;
        return restTemplate.getForObject(url, String.class);
    }
}
