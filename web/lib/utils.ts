import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WeatherData } from "./types";

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
export const currentDateMilliseconds = currentDate.getMilliseconds();
export const defaultYear = currentDate.getFullYear();
export const defaultMonth = (currentMonth + 1).toString();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getMonthName(monthNumber: number): string {
  // Adjust for 0-based index and handle out-of-range values
  const index = (((monthNumber - 1) % 12) + 12) % 12;
  return months[index];
}

// Function to check IndexedDB for existing data
export const checkIndexedDB = async (): Promise<{
  weatherData: WeatherData[] | null;
  storedDate: number | null;
}> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MonthsWeatherDB", 2);

    request.onerror = () => reject("Error opening database");

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(
        ["weatherData", "storedDate"],
        "readonly"
      );
      const weatherStore = transaction.objectStore("weatherData");
      const dateStore = transaction.objectStore("storedDate");

      const weatherRequest = weatherStore.get("weatherData");
      const dateRequest = dateStore.get("currentDate");

      let weatherData: WeatherData[] | null = null;
      let storedDate: number | null = null;

      weatherRequest.onsuccess = () => {
        weatherData = weatherRequest.result;
        if (dateRequest.readyState === "done") {
          resolve({ weatherData, storedDate });
        }
      };

      dateRequest.onsuccess = () => {
        storedDate = dateRequest.result;
        if (weatherRequest.readyState === "done") {
          resolve({ weatherData, storedDate });
        }
      };

      transaction.onerror = () => reject("Error fetching data from IndexedDB");
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("weatherData")) {
        db.createObjectStore("weatherData");
      }
      if (!db.objectStoreNames.contains("storedDate")) {
        db.createObjectStore("storedDate");
      }
    };
  });
};

// Function to store data in IndexedDB
export const storeInIndexedDB = async (data: WeatherData[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MonthsWeatherDB", 2);

    request.onerror = () => reject("Error opening database");

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(
        ["weatherData", "storedDate"],
        "readwrite"
      );
      const weatherStore = transaction.objectStore("weatherData");
      const dateStore = transaction.objectStore("storedDate");

      const weatherPutRequest = weatherStore.put(data, "weatherData");
      const datePutRequest = dateStore.put(
        currentDateMilliseconds,
        "currentDate"
      );

      weatherPutRequest.onerror = () =>
        reject("Error storing weather data in IndexedDB");
      datePutRequest.onerror = () => reject("Error storing date in IndexedDB");

      transaction.oncomplete = () => resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("weatherData")) {
        db.createObjectStore("weatherData");
      }
      if (!db.objectStoreNames.contains("storedDate")) {
        db.createObjectStore("storedDate");
      }
    };
  });
};
