package com.example.api.service;

import com.example.api.model.OpenMeteoData;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;

@Service
public class WeatherDataFetcher {

    private static final double LATITUDE = 40.4862;
    private static final double LONGITUDE = -74.4518;
    private static final String BASE_URL_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive";
    private static final String BASE_URL_FORECAST = "https://api.open-meteo.com/v1/forecast";

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public CompletableFuture<OpenMeteoData> fetchWeatherData(int month, int year, String source) {
        return CompletableFuture.supplyAsync(() -> {
            String url = buildUrl(month, year, source);
            String response = fetchData(url);
            return parseResponse(response);
        });
    }

    private String buildUrl(int month, int year, String source) {
        LocalDate startDate, endDate;
        String baseUrl;

        if ("month".equals(source)) {
            startDate = LocalDate.of(year, month, 1);
            endDate = YearMonth.of(year, month).atEndOfMonth();
            baseUrl = BASE_URL_ARCHIVE;
        } else if ("today".equals(source)) {
            LocalDate today = LocalDate.now();
            startDate = today.withDayOfMonth(1);
            endDate = today;
            baseUrl = BASE_URL_FORECAST;
        } else {
            throw new IllegalArgumentException("Invalid source: " + source);
        }

        return String.format("%s?latitude=%.6f&longitude=%.6f&start_date=%s&end_date=%s" +
                "&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max" +
                "&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto",
                baseUrl, LATITUDE, LONGITUDE, startDate, endDate);
    }

    private String fetchData(String url) {
        String response = restTemplate.getForObject(url, String.class);
        if (response == null) {
            throw new RuntimeException("Network response was not ok");
        }
        return response;
    }

    private OpenMeteoData parseResponse(String response) {
        try {
            return objectMapper.readValue(response, OpenMeteoData.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing JSON response", e);
        }
    }
}