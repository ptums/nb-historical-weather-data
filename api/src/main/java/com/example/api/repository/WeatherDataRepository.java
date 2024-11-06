package com.example.api.repository;

import com.example.api.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    @Query("SELECT w FROM WeatherData w WHERE w.monthsYearsId = :monthsYearsId")
    List<WeatherData> findByMonthsYearsId(@Param("monthsYearsId") Long monthsYearsId);
}