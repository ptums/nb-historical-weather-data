package com.example.api.service;

import com.example.api.model.OpenMeteoData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;

@Service
public class WeatherDataFetcher {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public WeatherDataFetcher(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public CompletableFuture<OpenMeteoData> fetchWeatherData(int month, int year, String source) {
        return CompletableFuture.supplyAsync(() -> {
            double lat = 40.4862;
            double lon = -74.4518;
            String url = "";

            if (source == "month") {
                LocalDate startDate = LocalDate.of(year, month, 1);
                LocalDate endDate = YearMonth.of(year, month).atEndOfMonth();

                url = String.format(
                        "https://archive-api.open-meteo.com/v1/archive?latitude=%.6f&longitude=%.6f&start_date=%s&end_date=%s&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto",
                        lat, lon, startDate, endDate);
            }

            if (source == "today") {
                LocalDate today = LocalDate.now();
                LocalDate firstDayOfMonth = today.withDayOfMonth(1);

                String startDate = firstDayOfMonth.format(DateTimeFormatter.ISO_LOCAL_DATE);
                String endDate = today.format(DateTimeFormatter.ISO_LOCAL_DATE);

                url = String.format(
                        "https://api.open-meteo.com/v1/forecast?latitude=%.6f&longitude=%.6f&start_date=%s&end_date=%s&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto",
                        lat, lon, startDate, endDate);
            }

            String response = restTemplate.getForObject(url, String.class);
            if (response == null) {
                throw new RuntimeException("Network response was not ok");
            }

            try {
                return objectMapper.readValue(response, OpenMeteoData.class);
            } catch (Exception e) {
                throw new RuntimeException("Error parsing JSON response", e);
            }
        });
    }
}