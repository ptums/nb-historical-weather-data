package com.example.api.repository;

import com.example.api.model.MonthYear;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthYearRepository extends JpaRepository<MonthYear, Long> {
    Optional<MonthYear> findByMonthAndYear(String month, String year);

    @SuppressWarnings("null")
    List<MonthYear> findAll();

    @Query(value = "INSERT INTO months_years (month, year) " +
            "VALUES (:month, :year) " +
            "RETURNING *", nativeQuery = true)
    Optional<MonthYear> createMonthYear(String month, String year);
}