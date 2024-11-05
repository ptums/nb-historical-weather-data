"use client";

import { WeatherTable, YearMonthForm } from "./ui";
import { YearMonthProvider } from "./context/year-month-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <YearMonthProvider>
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <YearMonthForm />
            <div className="min-h-dvh">
              <WeatherTable />
            </div>
          </div>
        </main>
      </YearMonthProvider>
    </QueryClientProvider>
  );
}
