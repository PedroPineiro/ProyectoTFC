package com.pedro.ProyectoTFC.clients;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class LastFMClient {
    private static final String API_KEY = "0a5892d502119495bd3ec9524687d00a";
    private static final String BASE_URL = "https://ws.audioscrobbler.com/2.0/";

    private final RestTemplate restTemplate = new RestTemplate();

    public String searchAlbum(String artist, String album) {
        String url = BASE_URL + "?method=album.getinfo&api_key=" + API_KEY +
                "&artist=" + artist + "&album=" + album + "&format=json";
        return restTemplate.getForObject(url, String.class);
    }
}
