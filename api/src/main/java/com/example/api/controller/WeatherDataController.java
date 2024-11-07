package com.example.api.controller;

import com.example.api.model.*;
import com.example.api.service.WeatherDataService;
import java.time.Duration;
import java.util.List;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/weather")
public class WeatherDataController {

    private final WeatherDataService weatherDataService;
    private static final Logger logger = LoggerFactory.getLogger(WeatherDataService.class);

    @Autowired
    public WeatherDataController(WeatherDataService weatherDataService) {
        this.weatherDataService = weatherDataService;
    }

    @GetMapping(value = "/monthly/{year}/{month}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WeatherData>> getMonthlyWeatherData(
            @PathVariable int year,
            @PathVariable @DateTimeFormat(pattern = "MM") int month) {
        try {
            List<WeatherData> weatherData = weatherDataService.getWeatherDataForMonth(year, month);
            return ResponseEntity.ok(weatherData);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/stream/{year}/{month}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<WeatherData> streamMonthlyWeatherData(
            @PathVariable int year,
            @PathVariable @DateTimeFormat(pattern = "MM") int month) {
        List<WeatherData> monthlyData = weatherDataService.getWeatherDataForMonth(year, month);
        return Flux.fromIterable(monthlyData)
                .delayElements(Duration.ofMillis(100)); // Delay each element by 100ms for demonstration
    }
}