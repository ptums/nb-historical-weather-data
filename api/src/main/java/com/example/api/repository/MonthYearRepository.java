package com.example.api.repository;

import com.example.api.model.MonthYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthYearRepository extends JpaRepository<MonthYear, Long> {
    Optional<MonthYear> findByMonthAndYear(String month, String year);
    @SuppressWarnings("null")
    List<MonthYear> findAll();
}