package com.example.api.controller;

import com.example.api.model.*;
import com.example.api.service.WeatherDataService;
import java.util.List;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/weather")
public class WeatherDataController {

    private final WeatherDataService weatherDataService;
    private static final Logger logger = LoggerFactory.getLogger(WeatherDataService.class);

    @Autowired
    public WeatherDataController(WeatherDataService weatherDataService) {
        this.weatherDataService = weatherDataService;
    }

    @PostMapping(value = "/monthly", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WeatherData>> postMonthlyWeatherData(@RequestBody MonthlyWeatherRequest request) {
        try {
            List<WeatherData> weatherData = weatherDataService.getWeatherDataForMonth(request.getYear(),
                    request.getMonth());
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
            List<WeatherData> weatherData = weatherDataService.getWeatherDataForMonth(year, month);
            return ResponseEntity.ok(weatherData);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

class MonthlyWeatherRequest {
    private int year;
    private int month;

    // Default constructor
    public MonthlyWeatherRequest() {
    }

    // Constructor with parameters
    public MonthlyWeatherRequest(int year, int month) {
        this.year = year;
        this.month = month;
    }

    // Getters and setters
    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }
}