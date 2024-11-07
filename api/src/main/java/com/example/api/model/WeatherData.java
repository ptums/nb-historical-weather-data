package com.example.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "high_temp", nullable = false)
    private double highTemp;

    @Column(name = "low_temp", nullable = false)
    private double lowTemp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Weather weather;

    @Column(name = "wind_speed", nullable = false)
    private double windSpeed;

    @Column(name = "months_years_id", nullable = false)
    private Long monthsYearsId;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getHighTemp() {
        return highTemp;
    }

    public void setHighTemp(double highTemp) {
        this.highTemp = highTemp;
    }

    public double getLowTemp() {
        return lowTemp;
    }

    public void setLowTemp(double lowTemp) {
        this.lowTemp = lowTemp;
    }

    public Weather getWeather() {
        return weather;
    }

    public void setWeather(Weather weather) {
        this.weather = weather;
    }

    public double getWindSpeed() {
        return windSpeed;
    }

    public void setWindSpeed(double windSpeed) {
        this.windSpeed = windSpeed;
    }

    public Long getMonthsYearsId() {
        return monthsYearsId;
    }

    public void setMonthsYearsId(Long monthsYearsId) {
        this.monthsYearsId = monthsYearsId;
    }

    @Override
    public String toString() {
        return "WeatherData{" +
                "id=" + id +
                ", date=" + date +
                ", highTemp=" + highTemp +
                ", lowTemp=" + lowTemp +
                ", weather=" + weather +
                ", windSpeed=" + windSpeed +
                ", monthsYearsId=" + monthsYearsId +
                '}';
    }

    public enum Weather {
        CLEAR, MAINLY_CLEAR, PARTLY_CLOUDY, OVERCAST, FOG, DRIZZLE, RAIN, SNOW, RAIN_SHOWERS, SNOW_SHOWERS,
        THUNDERSTORM, UNKNOWN
    }
}