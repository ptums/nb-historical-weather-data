export type WeatherData = {
  date: number;
  highTemp: number;
  lowTemp: number;
  weather:
    | "CLEAR"
    | "MAINLY_CLEAR"
    | "PARTLY_CLOUDY"
    | "OVERCAST"
    | "FOG"
    | "RAIN"
    | "DRIZZLE"
    | "SNOW"
    | "RAIN_SHOWERS"
    | "SNOW_SHOWERS"
    | "THUNDERSTORM"
    | "SUNNY"
    | "UNKNOWN";
  windSpeed: number;
};
