package com.example.api.service;

import com.example.api.model.MonthYear;
import com.example.api.model.WeatherData;
import com.example.api.repository.MonthYearRepository;
import com.example.api.repository.WeatherDataRepository;
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

    @Autowired
    public WeatherDataService(WeatherDataRepository weatherDataRepository, MonthYearRepository monthYearRepository) {
        this.weatherDataRepository = weatherDataRepository;
        this.monthYearRepository = monthYearRepository;
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
            throw new RuntimeException("No data found for month " + monthString + " and year " + yearString + ". Available months and years: " + allMonthYears);
        }

        MonthYear monthYear = monthYearOptional.get();
        logger.info("Found MonthYear entry: {}", monthYear);

        List<WeatherData> weatherDataList = weatherDataRepository.findByMonthsYearsId(monthYear.getId());

        if (weatherDataList.isEmpty()) {
            logger.warn("No weather data found for MonthYear id: {}", monthYear.getId());
            throw new RuntimeException("No weather data found for month " + monthString + " and year " + yearString + " (MonthYear id: " + monthYear.getId() + ")");
        }

        logger.info("Found {} weather data entries", weatherDataList.size());
        
        for (WeatherData data : weatherDataList) {
            logger.debug("Weather data - ID: {}, Date: {}, High Temp: {}, Low Temp: {}, Weather: {}, Wind Speed: {}, Months Years ID: {}",
        data.getId(), data.getDate(), data.getHighTemp(), data.getLowTemp(), data.getWeather(), data.getWindSpeed(), data.getMonthsYearsId());
}

        return weatherDataList;
    }
}