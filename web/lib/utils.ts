import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WeatherData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonthName(monthNumber: number): string {
  // Adjust for 0-based index and handle out-of-range values
  const index = (((monthNumber - 1) % 12) + 12) % 12;
  return months[index];
}

export const mapWeatherCode = (code: number): WeatherData["weather"] => {
  switch (code) {
    case 0:
      return "clear";
    case 1:
    case 2:
      return "mainlyClear";
    case 3:
      return "partlyCloudy";
    case 45:
    case 48:
      return "fog";
    case 51:
    case 53:
    case 55:
      return "drizzle";
    case 61:
    case 63:
    case 65:
      return "rain";
    case 71:
    case 73:
    case 75:
      return "snow";
    case 80:
    case 81:
    case 82:
      return "rainShowers";
    case 85:
    case 86:
      return "snowShowers";
    case 95:
    case 96:
    case 99:
      return "thunderstorm";
    default:
      return "unknown";
  }
};
