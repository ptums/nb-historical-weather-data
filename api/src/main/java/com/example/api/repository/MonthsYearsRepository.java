package com.example.api.repository;

import com.example.api.model.MonthsYears;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface MonthsYearsRepository extends JpaRepository<MonthsYears, Long> {
    Optional<MonthsYears> findByMonthAndYear(String month, String year);

    @SuppressWarnings("null")
    List<MonthsYears> findAll();

    @Query(value = "INSERT INTO months_years (month, year) " +
            "VALUES (:month, :year) " +
            "RETURNING *", nativeQuery = true)
    Optional<MonthsYears> createMonthsYears(String month, String year);
}