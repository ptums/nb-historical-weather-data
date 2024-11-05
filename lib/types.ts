export type WeatherData = {
  date: number;
  highTemp: number;
  lowTemp: number;
  weather: "sunny" | "cloudy" | "partlyCloudy" | "rainy";
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
