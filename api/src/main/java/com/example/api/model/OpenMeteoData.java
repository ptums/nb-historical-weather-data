package com.example.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class OpenMeteoData {
    private double latitude;
    private double longitude;

    @JsonProperty("generationtime_ms")
    private double generationtimeMs;

    @JsonProperty("utc_offset_seconds")
    private int utcOffsetSeconds;

    private String timezone;

    @JsonProperty("timezone_abbreviation")
    private String timezoneAbbreviation;

    private int elevation;

    @JsonProperty("daily_units")
    private DailyUnits dailyUnits;

    private Daily daily;

    // Getters and setters for all fields

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getGenerationtimeMs() {
        return generationtimeMs;
    }

    public void setGenerationtimeMs(double generationtimeMs) {
        this.generationtimeMs = generationtimeMs;
    }

    public int getUtcOffsetSeconds() {
        return utcOffsetSeconds;
    }

    public void setUtcOffsetSeconds(int utcOffsetSeconds) {
        this.utcOffsetSeconds = utcOffsetSeconds;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getTimezoneAbbreviation() {
        return timezoneAbbreviation;
    }

    public void setTimezoneAbbreviation(String timezoneAbbreviation) {
        this.timezoneAbbreviation = timezoneAbbreviation;
    }

    public int getElevation() {
        return elevation;
    }

    public void setElevation(int elevation) {
        this.elevation = elevation;
    }

    public DailyUnits getDailyUnits() {
        return dailyUnits;
    }

    public void setDailyUnits(DailyUnits dailyUnits) {
        this.dailyUnits = dailyUnits;
    }

    public Daily getDaily() {
        return daily;
    }

    public void setDaily(Daily daily) {
        this.daily = daily;
    }

    public static class DailyUnits {
        private String time;

        @JsonProperty("temperature_2m_max")
        private String temperature2mMax;

        @JsonProperty("temperature_2m_min")
        private String temperature2mMin;

        private String weathercode;

        @JsonProperty("windspeed_10m_max")
        private String windspeed10mMax;

        // Getters and setters for all fields

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getTemperature2mMax() {
            return temperature2mMax;
        }

        public void setTemperature2mMax(String temperature2mMax) {
            this.temperature2mMax = temperature2mMax;
        }

        public String getTemperature2mMin() {
            return temperature2mMin;
        }

        public void setTemperature2mMin(String temperature2mMin) {
            this.temperature2mMin = temperature2mMin;
        }

        public String getWeathercode() {
            return weathercode;
        }

        public void setWeathercode(String weathercode) {
            this.weathercode = weathercode;
        }

        public String getWindspeed10mMax() {
            return windspeed10mMax;
        }

        public void setWindspeed10mMax(String windspeed10mMax) {
            this.windspeed10mMax = windspeed10mMax;
        }
    }

    public static class Daily {
        private List<String> time;

        @JsonProperty("temperature_2m_max")
        private List<Double> temperature2mMax;

        @JsonProperty("temperature_2m_min")
        private List<Double> temperature2mMin;

        private List<Integer> weathercode;

        @JsonProperty("windspeed_10m_max")
        private List<Double> windspeed10mMax;

        // Getters and setters for all fields

        public List<String> getTime() {
            return time;
        }

        public void setTime(List<String> time) {
            this.time = time;
        }

        public List<Double> getTemperature2mMax() {
            return temperature2mMax;
        }

        public void setTemperature2mMax(List<Double> temperature2mMax) {
            this.temperature2mMax = temperature2mMax;
        }

        public List<Double> getTemperature2mMin() {
            return temperature2mMin;
        }

        public void setTemperature2mMin(List<Double> temperature2mMin) {
            this.temperature2mMin = temperature2mMin;
        }

        public List<Integer> getWeathercode() {
            return weathercode;
        }

        public void setWeathercode(List<Integer> weathercode) {
            this.weathercode = weathercode;
        }

        public List<Double> getWindspeed10mMax() {
            return windspeed10mMax;
        }

        public void setWindspeed10mMax(List<Double> windspeed10mMax) {
            this.windspeed10mMax = windspeed10mMax;
        }
    }
}