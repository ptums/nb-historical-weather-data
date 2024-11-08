"use client";

import { SiteTitle, WeatherTable, YearMonthForm } from "./ui";
import { useYearMonth, YearMonthProvider } from "./context/year-month-context";
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
import { useCallback, useEffect, useMemo, useState, useId } from "react";
import { Sidebar } from "./ui/displays/sidebar";
import ToggleFetchToggle from "./ui/toggle-fetch";
import {
  useWeatherData,
  WeatherDataProvider,
} from "./context/weather-data-context";
import { dummieItems } from "@/lib/dummie-data";
import { MonthYear, WeatherData } from "@/lib/types";
import {
  checkIndexedDB,
  currentDateMilliseconds,
  storeInIndexedDB,
} from "@/lib/utils";
import { fetchMonthsYearsData, fetchTodayWeatherData } from "@/lib/api";

const queryClient = new QueryClient();

const Page = () => {
  const { isToggleFetch, setIsToggleFetch } = useToggleFetch();
  const [shouldFetch, setShouldFetch] = useState(false);
  const { setWeatherData } = useWeatherData();
  const [userId, setUserId] = useState("");
  const { month, year } = useYearMonth();

  // Sync display toggle fetch
  const syncDisplayToggleFetch = useCallback(() => {
    try {
      const storedDisplayToggleFetch =
        localStorage.getItem("displayToggleFetch");
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
      if (
        existingData.weatherData &&
        currentDateMilliseconds === existingData.storedDate
      ) {
        setWeatherData(existingData.weatherData);
      } else {
        setShouldFetch(true);
      }
    };
    checkData();
  }, []);

  const { data: todaysWeather } = useQuery<WeatherData[], Error>({
    queryKey: ["weatherData"],
    queryFn: fetchTodayWeatherData,
    enabled: shouldFetch,
  });

  const { data: monthYears } = useQuery<MonthYear[], Error>({
    queryKey: ["monthYears"],
    queryFn: () => fetchMonthsYearsData(parseInt(month), year),
    enabled: userId !== "" && month !== "" && year > 0,
  });

  useEffect(() => {
    if (todaysWeather) {
      storeInIndexedDB(todaysWeather);
      setWeatherData(todaysWeather);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todaysWeather]);

  // Dummie items
  const historyItems = useMemo(() => dummieItems(), []);
  const comparisonItems = useMemo(() => dummieItems(), []);

  // set user id
  const randomId = useId();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    if (!storedUserId) {
      localStorage.setItem("user_id", randomId);
      setUserId(randomId);
      console.log("New user_id set in localStorage:", randomId);
    } else {
      setUserId(storedUserId);
      console.log("Existing user_id found in localStorage:", storedUserId);
    }
  }, [randomId]);

  // Get sidebar history & comparison based on userID

  useEffect(() => {
    if (userId) {
      console.log("get sidebar data");
      console.log(monthYears);
    }
  }, [userId, monthYears]);

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
