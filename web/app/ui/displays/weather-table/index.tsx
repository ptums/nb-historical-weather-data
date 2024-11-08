"use client";

import React, { useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useYearMonth } from "@/app/context/year-month-context";
import { getMonthName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dummieData } from "@/lib/dummie-data";
import { columns } from "./columns";
import { useToggleFetch } from "@/app/context/toggle-fetch-context";

const fetchWeatherData = async (month: number, year: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/weather/monthly/${year}/${month}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return [...data];
};

export const WeatherTable = () => {
  const { month, year, isSubmitted, setIsSubmitted } = useYearMonth();
  const { isToggleFetch } = useToggleFetch();
  const { data, isLoading, error } = useQuery({
    queryKey: ["weatherData", month, year], // Including month and year for cache uniqueness
    queryFn: () => fetchWeatherData(parseInt(month), year),
    enabled: isSubmitted && isToggleFetch, // This will only enable the query when isSubmitted is true
    staleTime: Infinity, // You might want to adjust this based on how often you need fresh data
  });

  const weatherData = useMemo(() => {
    if (isToggleFetch) {
      return dummieData;
    }

    return data ? data : [];
  }, [data, isToggleFetch]);

  const table = useReactTable({
    data: weatherData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(weatherData);

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
};
