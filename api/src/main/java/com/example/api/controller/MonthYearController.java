package com.example.api.controller;

import com.example.api.model.*;
import com.example.api.repository.MonthYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/month-year")
public class MonthYearController {

    private final MonthYearRepository monthYearRepository;

    @Autowired
    public MonthYearController(MonthYearRepository monthYearRepository) {
        this.monthYearRepository = monthYearRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createMonthYear(@RequestBody MonthWeatherRequest request) {
        try {
            String monthString = String.format("%02d", request.getMonth());
            String yearString = String.valueOf(request.getYear());

            // Create a new MonthYear entity from the request
            MonthYear monthYear = new MonthYear();
            monthYear.setMonth(monthString);
            monthYear.setYear(yearString);

            // Save the new MonthYear entry
            MonthYear savedMonthYear = monthYearRepository.save(monthYear);

            // Return the saved entity with a 201 Created status
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMonthYear);
        } catch (Exception e) {
            // Log the exception (you might want to use a proper logging framework)
            System.err.println("Error creating MonthYear: " + e.getMessage());

            // Return a 500 Internal Server Error status
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the MonthYear entry");
        }
    }
}