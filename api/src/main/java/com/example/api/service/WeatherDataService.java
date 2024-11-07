package com.example.api.service;

import com.example.api.mapper.WeatherDataMapper;
import com.example.api.model.*;
import com.example.api.repository.MonthYearRepository;
import com.example.api.repository.WeatherDataRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WeatherDataService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherDataService.class);

    private final WeatherDataRepository weatherDataRepository;
    private final MonthYearRepository monthYearRepository;
    private final WeatherDataFetcher weatherDataFetcher;
    private final WeatherDataMapper weatherDataMapper;

    @Autowired
    public WeatherDataService(WeatherDataRepository weatherDataRepository, MonthYearRepository monthYearRepository,
            WeatherDataFetcher weatherDataFetcher, WeatherDataMapper weatherDataMapper) {
        this.weatherDataRepository = weatherDataRepository;
        this.monthYearRepository = monthYearRepository;
        this.weatherDataFetcher = weatherDataFetcher;
        this.weatherDataMapper = weatherDataMapper;
    }

    public List<WeatherData> getWeatherDataForMonth(int year, int month) {
        String monthString = String.format("%02d", month);
        String yearString = String.valueOf(year);
        logger.info("Searching for weather data for month: {} and year: {}", monthString, yearString);

        Optional<MonthYear> monthYearOptional = monthYearRepository.findByMonthAndYear(monthString, yearString);

        if (monthYearOptional.isEmpty()) {
            logger.warn("No entry found in months_years table for month: {} and year: {}", monthString, yearString);
            List<MonthYear> allMonthYears = monthYearRepository.findAll();
            logger.info("Available entries in months_years table: {}", allMonthYears);
            throw new RuntimeException("No data found for month " + monthString + " and year " + yearString
                    + ". Available months and years: " + allMonthYears);
        }

        MonthYear monthYear = monthYearOptional.get();
        logger.info("Found MonthYear entry: {}", monthYear);

        List<WeatherData> weatherDataList = weatherDataRepository.findByMonthsYearsId(monthYear.getId());

        if (weatherDataList.isEmpty()) {
            logger.warn("No weather data found for MonthYear id: {}", monthYear.getId());
            throw new RuntimeException("No weather data found for month " + monthString + " and year " + yearString
                    + " (MonthYear id: " + monthYear.getId() + ")");
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
    public WeatherData saveWeatherData(int year, int month, OpenMeteoData data) {
        String monthString = String.format("%02d", month);
        String yearString = String.valueOf(year);
        Long monthYearId = null;
        WeatherData weatherData = null;

        logger.info("Searching for weather data for month: {} and year: {}", monthString, yearString);

        Optional<MonthYear> monthYearOptional = monthYearRepository.findByMonthAndYear(monthString, yearString);

        if (monthYearOptional.isEmpty()) {
            logger.warn("No entry found in months_years table for month: {} and year: {}", monthString, yearString);
            logger.info("Creating new entry in months_years table for month: {} and year: {}", monthString, yearString);

            // Create a new months_years entry
            Optional<MonthYear> createMonthYear = monthYearRepository.createMonthYear(monthString, yearString);

            MonthYear newMonthYear = createMonthYear.get();

            monthYearId = newMonthYear.getId();

        }

        if (monthYearId != null) {
            logger.info("Finding weather data based on montYearId...");
            List<WeatherData> weatherDataList = weatherDataRepository.findByMonthsYearsId(monthYearId);
            logger.info("Found {} weather data entries from monthYearId", weatherDataList.size());

            for (WeatherData d : weatherDataList) {
                logger.debug(
                        "Weather data - ID: {}, Date: {}, High Temp: {}, Low Temp: {}, Weather: {}, Wind Speed: {}, Months Years ID: {}",
                        d.getId(),
                        d.getDate(),
                        d.getHighTemp(),
                        d.getLowTemp(),
                        d.getWeather(),
                        d.getWindSpeed(),
                        d.getMonthsYearsId());
            }
            // Add functionality to fetch data from open meteor api here
            // CompletableFuture<OpenMeteoData> fetchWeatherData =
            // weatherDataFetcher.fetchWeatherData(month, year);
            // logger.info("fetchWeatherData {}", fetchWeatherData);

            // weatherData = weatherDataRepository.createWeatherData(
            // fetchWeatherData,
            // monthYearId);

            if (weatherData == null) {
                logger.error("Could not created weather data entries");
            }

            // else {
            // logger.info("Created weather data entries");
            // logger.debug(
            // "Weather data - ID: {}, Date: {}, High Temp: {}, Low Temp: {}, Weather: {},
            // Wind Speed: {}, Months Years ID: {}",
            // weatherData.getId(),
            // weatherData.getDate(),
            // weatherData.getHighTemp(),
            // weatherData.getLowTemp(),
            // weatherData.getWeather(),
            // weatherData.getWindSpeed(),
            // weatherData.getMonthsYearsId());
            // }

        }

        return weatherData;
    }
}