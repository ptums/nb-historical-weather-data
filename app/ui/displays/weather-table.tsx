"use client";

import React, { useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { WeatherData } from "@/lib/types";
import { useYearMonth } from "@/app/context/year-month-context";
import { getMonthName, mapWeatherCode } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { DUMMIE_DATA_FLAG, LOCATION } from "@/lib/constants";
import { dummieData } from "@/lib/dummie-data";
import { columns } from "./columns";

const fetchWeatherData = async (
  lat: number,
  long: number,
  month: number,
  year: number
) => {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${month.toString().padStart(2, "0")}-${new Date(
    year,
    month,
    0
  ).getDate()}`;

  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${long}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`
  );
  const data = await response.json();

  console.log({
    data,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return data;
};

const mapOpenMeteoToWeatherData = (data: {
  daily: {
    time: {
      map: (
        arg0: (
          date: string,
          index: number
        ) => {
          date: number;
          highTemp: number;
          lowTemp: number;
          weather: WeatherData["weather"];
          windSpeed: string;
        }
      ) => WeatherData[];
    };
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}): WeatherData[] => {
  return data.daily.time.map((date: string, index: number) => ({
    date: new Date(date).getDate(),
    highTemp: Math.round(data.daily.temperature_2m_max[index]),
    lowTemp: Math.round(data.daily.temperature_2m_min[index]),
    weather: mapWeatherCode(data.daily.weathercode[index]),
    windSpeed: "new", // OpenMeteo doesn't provide moon phase data, so we're using a placeholder
  }));
};

export function WeatherTable() {
  const { month, year, isSubmitted, setIsSubmitted } = useYearMonth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["weatherData", month, year], // Including month and year for cache uniqueness
    queryFn: () =>
      fetchWeatherData(LOCATION.lat, LOCATION.long, parseInt(month), year),
    enabled: isSubmitted && !DUMMIE_DATA_FLAG, // This will only enable the query when isSubmitted is true
    staleTime: Infinity, // You might want to adjust this based on how often you need fresh data
  });

  const weatherData = useMemo(() => {
    if (DUMMIE_DATA_FLAG) {
      return dummieData;
    }

    return data ? mapOpenMeteoToWeatherData(data) : [];
  }, [data]);

  const table = useReactTable({
    data: weatherData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (weatherData.length > 0) {
      setIsSubmitted(false);
    }
  }, [weatherData, setIsSubmitted]);

  if (isLoading) return <div>Loading weather data...</div>;
  if (error)
    return <div>Error fetching weather data: {(error as Error).message}</div>;

  return (
    <div className="mt-6 p-2">
      <div className="flex flex-row space-between mb-6">
        <p className="mr-4">
          <strong>Month: </strong> {getMonthName(parseInt(month))}
        </p>
        <p>
          <strong>Year: </strong> {year}
        </p>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
