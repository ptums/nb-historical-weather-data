"use client";

import { WeatherTable, YearMonthForm } from "./ui";
import { YearMonthProvider } from "./context/year-month-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ToggleFetchProvider,
  useToggleFetch,
} from "./context/toggle-fetch-context";
import classNames from "classnames";
import KeyListener from "./key-listener";
import { useCallback, useEffect } from "react";

const queryClient = new QueryClient();

const Page = () => {
  const { isToggleFetch, toggleDisplayToggleFetch } = useToggleFetch();

  const syncDisplayToggleFetch = useCallback(() => {
    try {
      const storedDisplayToggleFetch =
        localStorage.getItem("displayToggleFetch");
      console.log("storedDisplayToggleFetch", storedDisplayToggleFetch);
      if (storedDisplayToggleFetch !== null) {
        const shouldDisplay = storedDisplayToggleFetch === "true";
        toggleDisplayToggleFetch(shouldDisplay);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [toggleDisplayToggleFetch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "t") {
        event.preventDefault(); // Prevent default browser behavior
        syncDisplayToggleFetch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [syncDisplayToggleFetch]);

  return (
    <>
      <KeyListener />
      <main
        className={classNames(
          "flex min-h-screen flex-col items-center justify-center p-24",
          {
            "bg-yellow-50": !isToggleFetch,
            "bg-gray-100": isToggleFetch,
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
    </>
  );
};

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <YearMonthProvider>
        <ToggleFetchProvider>
          <Page />
        </ToggleFetchProvider>
      </YearMonthProvider>
    </QueryClientProvider>
  );
}
