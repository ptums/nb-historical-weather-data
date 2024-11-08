package com.example.api.controller;

import com.example.api.model.HistorySideBar;
import com.example.api.model.MonthYear;
import com.example.api.repository.HistorySideBarRepository;
import com.example.api.repository.MonthYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/sidebar")
public class SideBarController {
    private final HistorySideBarRepository historySideBarRepository;
    private final MonthYearRepository monthYearRepository;

    @Autowired
    public SideBarController(HistorySideBarRepository historySideBarRepository,
            MonthYearRepository monthYearRepository) {
        this.historySideBarRepository = historySideBarRepository;
        this.monthYearRepository = monthYearRepository;
    }

    @GetMapping(value = "/history/{userId}/{monthYearId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getHistory(@PathVariable String userId, @PathVariable Long monthYearId) {
        List<HistorySideBar> historyEntries = historySideBarRepository.findAllByUserId(userId);

        if (historyEntries.isEmpty()) {
            // Create a new entry if userId is not found
            HistorySideBar newEntry = new HistorySideBar();
            newEntry.setUserId(userId);
            newEntry.setMonthsYearsId(monthYearId);
            historySideBarRepository.save(newEntry);

            // Fetch the MonthYear object for the new entry
            Optional<MonthYear> monthYear = monthYearRepository.findById(monthYearId);
            return monthYear.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        List<MonthYear> monthYears = historyEntries.stream()
                .map(entry -> monthYearRepository.findById(entry.getMonthsYearsId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();

        return ResponseEntity.ok(monthYears);
    }
}