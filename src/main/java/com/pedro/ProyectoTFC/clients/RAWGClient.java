package com.pedro.ProyectoTFC.clients;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RAWGClient {
    private static final String API_KEY = "3750043c8ab7467199e2bbd7b7427080";
    private static final String BASE_URL = "https://api.rawg.io/api";

    private final RestTemplate restTemplate = new RestTemplate();

    public String searchGame(String query) {
        String url = BASE_URL + "/games?key=" + API_KEY + "&search=" + query;
        return restTemplate.getForObject(url, String.class);
    }
}
