"use client";

import { SiteTitle, WeatherTable, YearMonthForm } from "./ui";
import { YearMonthProvider } from "./context/year-month-context";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  ToggleFetchProvider,
  useToggleFetch,
} from "./context/toggle-fetch-context";
import classNames from "classnames";
import KeyListener from "./key-listener";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "./ui/displays/sidebar";
import ToggleFetchToggle from "./ui/toggle-fetch";
import {
  useWeatherData,
  WeatherDataProvider,
} from "./context/weather-data-context";
import { dummieItems } from "@/lib/dummie-data";
import { WeatherData } from "@/lib/types";
import {
  checkIndexedDB,
  fetchTodayWeatherData,
  storeInIndexedDB,
} from "@/lib/utils";

const queryClient = new QueryClient();

const Page = () => {
  const { isToggleFetch, setIsToggleFetch } = useToggleFetch();
  const [shouldFetch, setShouldFetch] = useState(false);
  const { setWeatherData } = useWeatherData();

  // Sync display toggle fetch
  const syncDisplayToggleFetch = useCallback(() => {
    try {
      const storedDisplayToggleFetch =
        localStorage.getItem("displayToggleFetch");
      console.log("storedDisplayToggleFetch", storedDisplayToggleFetch);
      if (storedDisplayToggleFetch !== null) {
        const shouldDisplay = storedDisplayToggleFetch === "true";
        setIsToggleFetch(shouldDisplay);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, [setIsToggleFetch]);

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

  // get the latest weather data
  useEffect(() => {
    const checkData = async () => {
      const existingData = await checkIndexedDB();
      if (existingData) {
        setWeatherData(existingData);
      } else {
        setShouldFetch(true);
      }
    };
    checkData();
  }, []);

  const { data } = useQuery<WeatherData[], Error>({
    queryKey: ["weatherData"],
    queryFn: fetchTodayWeatherData,
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (data) {
      storeInIndexedDB(data);
      setWeatherData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Dummie items
  const historyItems = useMemo(() => dummieItems(), []);
  const comparisonItems = useMemo(() => dummieItems(), []);

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
      <WeatherDataProvider>
        <YearMonthProvider>
          <ToggleFetchProvider>
            <Page />
          </ToggleFetchProvider>
        </YearMonthProvider>
      </WeatherDataProvider>
    </QueryClientProvider>
  );
}
