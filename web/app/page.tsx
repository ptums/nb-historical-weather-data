"use client";

import { SiteTitle, WeatherTable, YearMonthForm } from "./ui";
import { YearMonthProvider } from "./context/year-month-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ToggleFetchProvider,
  useToggleFetch,
} from "./context/toggle-fetch-context";
import classNames from "classnames";
import KeyListener from "./key-listener";
import { useCallback, useEffect, useMemo } from "react";
import { Sidebar } from "./ui/displays/sidebar";
import ToggleFetchToggle from "./ui/toggle-fetch";

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

  const historyItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      const year = Math.floor(Math.random() * (2024 - 1940 + 1)) + 1940;
      const month = Math.floor(Math.random() * 12) + 1;
      items.push({ year, month });
    }
    return items;
  }, []);

  const comparisonItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      const year = Math.floor(Math.random() * (2024 - 1940 + 1)) + 1940;
      const month = Math.floor(Math.random() * 12) + 1;
      items.push({ year, month });
    }
    return items;
  }, []);

  return (
    <>
      <KeyListener />
      <ToggleFetchToggle />
      <main
        className={classNames("flex min-h-screen", {
          "bg-yellow-50": !isToggleFetch,
          "bg-gray-100": isToggleFetch,
        })}
      >
        <Sidebar title="History" items={historyItems} />
        <Sidebar
          title="Comparison"
          items={comparisonItems}
          displayShadow={true}
        />
        <div className="flex flex-col items-center justify-center w-full py-8">
          <SiteTitle />
          <YearMonthForm />
          <div className="min-h-screen w-full sm:w-3/4">
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
