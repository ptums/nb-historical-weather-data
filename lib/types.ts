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
  moonPhase:
    | "new"
    | "waxingCrescent"
    | "firstQuarter"
    | "waxingGibbous"
    | "full"
    | "waningGibbous"
    | "lastQuarter"
    | "waningCrescent";
};
