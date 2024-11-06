import { WeatherData } from "@/lib/types";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Snowflake,
  CloudLightning,
  CloudFog,
  Wind,
} from "lucide-react";

const columnHelper = createColumnHelper<WeatherData>();

const getWindIcon = (windSpeed: number) => {
  if (windSpeed < 5) return <Wind className="text-gray-300" />;
  if (windSpeed < 10) return <Wind className="text-gray-400" />;
  if (windSpeed < 15) return <Wind className="text-gray-500" />;
  if (windSpeed < 20) return <Wind className="text-gray-600" />;
  return <Wind className="text-gray-700" />;
};

export const columns = [
  columnHelper.accessor("date", {
    cell: (info) => info.getValue(),
    header: () => <span>Date</span>,
  }),
  columnHelper.accessor("windSpeed", {
    cell: (info) => {
      const windSpeed = info.getValue();
      return (
        <div className="flex items-center">
          {getWindIcon(windSpeed)}
          <span className="ml-2">{windSpeed} mph</span>
        </div>
      );
    },
    header: () => <span>Wind Speed</span>,
  }),
  columnHelper.accessor("weather", {
    cell: (info) => {
      const weather = info.getValue();
      switch (weather) {
        case "clear":
          return <Sun className="text-yellow-400" />;
        case "mainlyClear":
          return <Sun className="text-yellow-400" />;
        case "partlyCloudy":
          return <CloudSun className="text-gray-400" />;
        case "overcast":
          return <Cloud className="text-gray-400" />;
        case "fog":
          return <CloudFog className="text-gray-400" />;
        case "drizzle":
          return <Droplets className="text-blue-300" />;
        case "rain":
          return <CloudRain className="text-blue-400" />;
        case "snow":
          return <Snowflake className="text-blue-200" />;
        case "rainShowers":
          return <CloudRain className="text-blue-500" />;
        case "snowShowers":
          return <Snowflake className="text-blue-300" />;
        case "thunderstorm":
          return <CloudLightning className="text-yellow-500" />;
        case "unknown":
          return <Cloud className="text-gray-300" />;
        default:
          return null;
      }
    },
    header: () => <span>Weather</span>,
  }),
  columnHelper.accessor("highTemp", {
    cell: (info) => `${info.getValue()}°F`,
    header: () => <span>High</span>,
  }),
  columnHelper.accessor("lowTemp", {
    cell: (info) => `${info.getValue()}°F`,
    header: () => <span>Low</span>,
  }),
];
