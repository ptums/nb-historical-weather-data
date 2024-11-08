import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { WeatherData } from "./types";

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

export async function fetchMonthWeatherData(month: number, year: number) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/weather/month`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ month, year }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return [...data];
}

export async function fetchTodayWeatherData() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/weather/today`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return [...data];
}

// Function to check IndexedDB for existing data
export const checkIndexedDB = async (): Promise<WeatherData[] | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MonthsWeatherDB", 1);

    request.onerror = () => reject("Error opening database");

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("weatherData", "readonly");
      const store = transaction.objectStore("weatherData");
      const getRequest = store.get("weatherData");

      getRequest.onerror = () => reject("Error fetching data from IndexedDB");
      getRequest.onsuccess = () => resolve(getRequest.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("weatherData");
    };
  });
};

// Function to store data in IndexedDB
export const storeInIndexedDB = async (data: WeatherData[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MonthsWeatherDB", 1);

    request.onerror = () => reject("Error opening database");

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("weatherData", "readwrite");
      const store = transaction.objectStore("weatherData");
      const putRequest = store.put(data, "weatherData");

      putRequest.onerror = () => reject("Error storing data in IndexedDB");
      putRequest.onsuccess = () => resolve();
    };
  });
};

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
export const defaultYear = currentDate.getFullYear();
export const defaultMonth = (currentMonth + 1).toString();
