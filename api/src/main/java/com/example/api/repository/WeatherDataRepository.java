package com.example.api.repository;

import com.example.api.model.WeatherData;
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
   WeatherData saveWeatherData(LocalDate date, double highTemp, double lowTemp, 
                                WeatherData.Weather weather, double windSpeed, Long monthsYearsId);
}