"use client";

import { WeatherTable, YearMonthForm } from "./ui";
import { YearMonthProvider } from "./context/year-month-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeProvider, useDarkMode } from "./context/dark-mode-context";
import classNames from "classnames";

const queryClient = new QueryClient();

const Page = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <main
      className={classNames(
        "flex min-h-screen flex-col items-center justify-center p-24",
        {
          "bg-yellow-50": !isDarkMode,
          "bg-gray-900": isDarkMode,
        }
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <YearMonthForm />
        <div className="min-h-dvh">
          <WeatherTable />
        </div>
      </div>
    </main>
  );
};

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <YearMonthProvider>
        <DarkModeProvider>
          <Page />
        </DarkModeProvider>
      </YearMonthProvider>
    </QueryClientProvider>
  );
}
