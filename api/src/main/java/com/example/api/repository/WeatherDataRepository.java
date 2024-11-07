package com.example.api.repository;

import com.example.api.model.WeatherData;
import com.example.api.model.WeatherData.Weather;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    @Query("SELECT w FROM WeatherData w WHERE w.monthsYearsId = :monthsYearsId")
    List<WeatherData> findByMonthsYearsId(@Param("monthsYearsId") Long monthsYearsId);

    @Query(value = "INSERT INTO weather_data (date, high_temp, low_temp, weather, wind_speed, months_years_id) " +
            "VALUES (:date, :highTemp, :lowTemp, :weather, :windSpeed, :monthsYearsId) " +
            "RETURNING *", nativeQuery = true)
    WeatherData createWeatherData(@Param("date") LocalDate date,
            @Param("highTemp") double highTemp,
            @Param("lowTemp") double lowTemp,
            @Param("weather") Weather weather,
            @Param("windSpeed") double windSpeed,
            @Param("monthsYearsId") Long monthsYearsId);
}