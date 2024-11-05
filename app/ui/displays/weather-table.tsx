"use client";

import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Moon,
  Circle,
  CircleDot,
} from "lucide-react";
import { WeatherData } from "@/lib/types";
import { dummyData } from "./data";
import { useYearMonth } from "@/app/context/year-month-context";
import { getMonthName } from "@/lib/utils";

const columnHelper = createColumnHelper<WeatherData>();

const columns = [
  columnHelper.accessor("date", {
    cell: (info) => info.getValue(),
    header: () => <span>Date</span>,
  }),
  columnHelper.accessor("moonPhase", {
    cell: (info) => {
      const phase = info.getValue();
      switch (phase) {
        case "new":
          return <Circle className="text-gray-400" />;
        case "waxingCrescent":
          return <CircleDot className="text-gray-400" />;
        case "firstQuarter":
          return <Moon className="text-gray-400" />;
        case "waxingGibbous":
          return <Moon className="text-gray-400" />;
        case "full":
          return <Moon className="text-gray-400 fill-current" />;
        case "waningGibbous":
          return <Moon className="text-gray-400" />;
        case "lastQuarter":
          return <Moon className="text-gray-400" />;
        case "waningCrescent":
          return <CircleDot className="text-gray-400" />;
        default:
          return null;
      }
    },
    header: () => <span>Moon Phase</span>,
  }),
  columnHelper.accessor("weather", {
    cell: (info) => {
      const weather = info.getValue();
      switch (weather) {
        case "sunny":
          return <Sun className="text-yellow-400" />;
        case "cloudy":
          return <Cloud className="text-gray-400" />;
        case "partlyCloudy":
          return <CloudSun className="text-gray-400" />;
        case "rainy":
          return <CloudRain className="text-blue-400" />;
        default:
          return null;
      }
    },
    header: () => <span>Weather</span>,
  }),
  columnHelper.accessor("highTemp", {
    cell: (info) => `${info.getValue()}°`,
    header: () => <span>High</span>,
  }),
  columnHelper.accessor("lowTemp", {
    cell: (info) => `${info.getValue()}°`,
    header: () => <span>Low</span>,
  }),
];

export function WeatherTable() {
  const table = useReactTable({
    data: dummyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { month, year } = useYearMonth();

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
