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
    Optional<MonthYear> saveMonthAndYear(String month, String year);
}