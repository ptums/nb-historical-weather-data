package com.example.api.service;

import com.example.api.mapper.WeatherDataMapper;
import com.example.api.model.*;
import com.example.api.repository.MonthYearRepository;
import com.example.api.repository.WeatherDataRepository;
import jakarta.transaction.Transactional;

import java.util.*;
import java.util.concurrent.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WeatherDataService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherDataService.class);

    private final WeatherDataRepository weatherDataRepository;
    private final MonthYearRepository monthYearRepository;
    private final WeatherDataMapper weatherDataMapper;
    private final WeatherDataFetcher weatherDataFetcher;

    @Autowired
    public WeatherDataService(WeatherDataRepository weatherDataRepository, MonthYearRepository monthYearRepository,
            WeatherDataMapper weatherDataMapper, WeatherDataFetcher weatherDataFetcher) {
        this.weatherDataRepository = weatherDataRepository;
        this.monthYearRepository = monthYearRepository;
        this.weatherDataMapper = weatherDataMapper;
        this.weatherDataFetcher = weatherDataFetcher;
    }

    public List<WeatherData> getWeatherDataForMonth(int year, int month) {
        String monthString = String.format("%02d", month);
        String yearString = String.valueOf(year);
        logger.info("Searching for weather data for month: {} and year: {}", monthString, yearString);

        Optional<MonthYear> monthYearOptional = monthYearRepository.findByMonthAndYear(monthString, yearString);

        logger.debug("monthYearOptional.isEmpty() {}", monthYearOptional.isEmpty());

        if (monthYearOptional.isEmpty()) {
            logger.info("HIT 1");
            List<WeatherData> weatherDataList = createWeatherData(month, year, monthString, yearString);
            return weatherDataList;
        } else {
            MonthYear monthYear = monthYearOptional.get();
            logger.debug("monthYear() {}", monthYear);
            logger.info("HIT 2");
            List<WeatherData> weatherDataList = findWeatherData(monthYear.getId(), monthString, yearString);
            return weatherDataList;
        }
    }

    private List<WeatherData> findWeatherData(Long monthYear, String monthString, String yearString) {
        List<WeatherData> weatherDataList = weatherDataRepository.findByMonthsYearsId(monthYear);

        if (weatherDataList.isEmpty()) {
            logger.warn("No weather data found for MonthYear id: {}", monthYear);
            throw new RuntimeException("No weather data found for month " + monthString + " and year " + yearString
                    + " (MonthYear id: " + monthYear + ")");
        }

        logger.info("Found {} weather data entries", weatherDataList.size());

        for (WeatherData data : weatherDataList) {
            logger.debug(
                    "Weather data - ID: {}, Date: {}, High Temp: {}, Low Temp: {}, Weather: {}, Wind Speed: {}, Months Years ID: {}",
                    data.getId(),
                    data.getDate(),
                    data.getHighTemp(),
                    data.getLowTemp(),
                    data.getWeather(),
                    data.getWindSpeed(),
                    data.getMonthsYearsId());
        }

        return weatherDataList;
    }

    @Transactional
    public List<WeatherData> createWeatherData(int month, int year, String monthString, String yearString) {
        logger.info("Creating weather data for month: {} and year: {}", monthString, yearString);

        // Create a new months_years entry
        Optional<MonthYear> createMonthYear = monthYearRepository.createMonthYear(monthString, yearString);
        if (createMonthYear.isEmpty()) {
            throw new RuntimeException("Failed to create MonthYear entry");
        }

        MonthYear newMonthYear = createMonthYear.get();
        Long monthYearId = newMonthYear.getId();

        logger.info("Created MonthYear entry with ID: {}", monthYearId);

        try {
            CompletableFuture<OpenMeteoData> fetchWeatherData = weatherDataFetcher.fetchWeatherData(month, year);
            OpenMeteoData openMeteoData = fetchWeatherData.get();
            List<WeatherData> openMeteoToWeatherData = weatherDataMapper.mapOpenMeteoToWeatherData(openMeteoData,
                    monthYearId);

            logger.info("Mapped {} weather data entries", openMeteoToWeatherData.size());

            List<WeatherData> savedWeatherData = weatherDataRepository.saveAll(openMeteoToWeatherData);

            logger.info("Successfully saved {} weather data entries", savedWeatherData.size());
            return savedWeatherData;

        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error while fetching or saving weather data", e);
            throw new RuntimeException("Failed to fetch or save weather data", e);
        }
    }
}