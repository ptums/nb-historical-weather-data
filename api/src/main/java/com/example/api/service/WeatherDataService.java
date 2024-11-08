package com.example.api.service;

import com.example.api.mapper.WeatherDataMapper;
import com.example.api.model.*;
import com.example.api.repository.MonthsYearsRepository;
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
    private final MonthsYearsRepository monthsYearsRepository;
    private final WeatherDataMapper weatherDataMapper;
    private final WeatherDataFetcher weatherDataFetcher;

    @Autowired
    public WeatherDataService(WeatherDataRepository weatherDataRepository, MonthsYearsRepository monthsYearsRepository,
            WeatherDataMapper weatherDataMapper, WeatherDataFetcher weatherDataFetcher) {
        this.weatherDataRepository = weatherDataRepository;
        this.monthsYearsRepository = monthsYearsRepository;
        this.weatherDataMapper = weatherDataMapper;
        this.weatherDataFetcher = weatherDataFetcher;
    }

    public List<WeatherData> getWeatherData(int year, int month, String source) {
        String monthString = String.format("%02d", month);
        String yearString = String.valueOf(year);
        logger.info("Searching for weather data for month: {} and year: {}", monthString, yearString);

        Optional<MonthsYears> MonthsYearsOptional = monthsYearsRepository.findByMonthAndYear(monthString, yearString);

        logger.debug("MonthsYearsOptional.isEmpty() {}", MonthsYearsOptional.isEmpty());

        if (MonthsYearsOptional.isEmpty()) {
            List<WeatherData> weatherDataList = createWeatherData(month, year, monthString, yearString, source);
            return weatherDataList;
        } else {
            MonthsYears MonthsYears = MonthsYearsOptional.get();
            logger.debug("MonthsYears() {}", MonthsYears);
            List<WeatherData> weatherDataList = findWeatherData(MonthsYears.getId(), monthString, yearString);
            return weatherDataList;
        }
    }

    private List<WeatherData> findWeatherData(Long MonthsYears, String monthString, String yearString) {
        List<WeatherData> weatherDataList = weatherDataRepository.findByMonthsYearsId(MonthsYears);

        if (weatherDataList.isEmpty()) {
            logger.warn("No weather data found for MonthsYears id: {}", MonthsYears);
            throw new RuntimeException("No weather data found for month " + monthString + " and year " + yearString
                    + " (MonthsYears id: " + MonthsYears + ")");
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
    public List<WeatherData> createWeatherData(int month, int year, String monthString, String yearString,
            String source) {
        logger.info("Creating weather data for month: {} and year: {}", monthString, yearString);

        MonthsYears monthsYearsEntry = new MonthsYears();
        monthsYearsEntry.setMonth(monthString);
        monthsYearsEntry.setYear(yearString);
        MonthsYears newMonthsYearsEntry = monthsYearsRepository.save(monthsYearsEntry);
        Long monthsYearsId = newMonthsYearsEntry.getId();

        logger.info("Created MonthsYears entry with ID: {}", monthsYearsId);

        try {
            CompletableFuture<OpenMeteoData> fetchWeatherData = weatherDataFetcher.fetchWeatherData(month, year,
                    source);
            OpenMeteoData openMeteoData = fetchWeatherData.get();
            List<WeatherData> openMeteoToWeatherData = weatherDataMapper.mapOpenMeteoToWeatherData(openMeteoData,
                    monthsYearsId);

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