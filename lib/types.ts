export type WeatherData = {
  date: number;
  highTemp: number;
  lowTemp: number;
  weather:
    | "clear"
    | "mainlyClear"
    | "partlyCloudy"
    | "overcast"
    | "fog"
    | "drizzle"
    | "rain"
    | "snow"
    | "rainShowers"
    | "snowShowers"
    | "thunderstorm"
    | "unknown";
  windSpeed: number;
};
