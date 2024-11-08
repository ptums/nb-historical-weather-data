package com.example.api.model;

public class MonthWeatherRequest {
    private int year;
    private int month;

    // Default constructor
    public MonthWeatherRequest() {
    }

    // Constructor with parameters
    public MonthWeatherRequest(int year, int month) {
        this.year = year;
        this.month = month;
    }

    // Getters and setters
    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }
}