package com.example.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "months_years")
public class MonthYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String month;

    @Column(nullable = false)
    private String year;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    @Override
    public String toString() {
        return "MonthYear{" +
                "id=" + id +
                ", month='" + month + '\'' +
                ", year='" + year + '\'' +
                '}';
    }
}