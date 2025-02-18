package com.pedro.ProyectoTFC.clients;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class TMDBClient {
    private static final String API_KEY = "998d343674fbacfea441d0e40df4f0ea";
    private static final String BASE_URL = "https://api.themoviedb.org/3";

    private final RestTemplate restTemplate = new RestTemplate();

    public String searchMovie(String query) {
        try {
            String url = BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + query;
            return restTemplate.getForObject(url, String.class);
        } catch (HttpClientErrorException e) {
            // Manejar errores de la API (por ejemplo, si hay un error 404 o 500)
            return "Error en la solicitud: " + e.getMessage();
        } catch (Exception e) {
            // Otros errores generales
            return "Error desconocido: " + e.getMessage();
        }
    }
}
