package com.example.api.mapper;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.IntStream;

import com.example.api.model.*;

import java.util.stream.Collectors;

public class WeatherDataMapper {

    public static List<WeatherData> mapOpenMeteoToWeatherData(OpenMeteoData data) {
        return IntStream.range(0, data.getDaily().getTime().size())
                .mapToObj(index -> {
                    WeatherData weatherData = new WeatherData();
                    weatherData.setDate(LocalDate.parse(data.getDaily().getTime().get(index)));
                    weatherData.setHighTemp(data.getDaily().getTemperature2mMax().get(index));
                    weatherData.setLowTemp(data.getDaily().getTemperature2mMin().get(index));
                    weatherData.setWeather(mapWeatherCode(data.getDaily().getWeathercode().get(index)));
                    weatherData.setWindSpeed(data.getDaily().getWindspeed10mMax().get(index));
                    return weatherData;
                })
                .collect(Collectors.toList());
    }

    private static WeatherData.Weather mapWeatherCode(int code) {
        switch (code) {
            case 0:
                return WeatherData.Weather.CLEAR;
            case 1:
            case 2:
                return WeatherData.Weather.MAINLY_CLEAR;
            case 3:
                return WeatherData.Weather.PARTLY_CLOUDY;
            case 45:
            case 48:
                return WeatherData.Weather.FOG;
            case 51:
            case 53:
            case 55:
                return WeatherData.Weather.DRIZZLE;
            case 61:
            case 63:
            case 65:
                return WeatherData.Weather.RAIN;
            case 71:
            case 73:
            case 75:
                return WeatherData.Weather.SNOW;
            case 80:
            case 81:
            case 82:
                return WeatherData.Weather.RAIN_SHOWERS;
            case 85:
            case 86:
                return WeatherData.Weather.SNOW_SHOWERS;
            case 95:
            case 96:
            case 99:
                return WeatherData.Weather.THUNDERSTORM;
            default:
                return WeatherData.Weather.UNKNOWN;
        }
    }
}