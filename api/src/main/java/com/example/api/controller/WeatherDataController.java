package com.example.api.controller;

import com.example.api.model.*;
import com.example.api.service.WeatherDataService;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/weather")
public class WeatherDataController {

    private final WeatherDataService weatherDataService;

    @Autowired
    public WeatherDataController(WeatherDataService weatherDataService) {
        this.weatherDataService = weatherDataService;
    }

    @PostMapping(value = "/month", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WeatherData>> postMonthlyWeatherData(@RequestBody MonthWeatherRequest request) {
        try {
            List<WeatherData> weatherData = weatherDataService.getWeatherData(request.getYear(),
                    request.getMonth(), "month");
            return ResponseEntity.ok(weatherData);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/today", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WeatherData>> getTodaysWeatherData() {
        try {
            LocalDate today = LocalDate.now();

            // Extract the month and year as integers
            int month = today.getMonthValue();
            int year = today.getYear();
            List<WeatherData> weatherData = weatherDataService.getWeatherData(year, month, "today");
            return ResponseEntity.ok(weatherData);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}