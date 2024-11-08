import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export async function fetchWeatherData(month: number, year: number) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/weather/monthly`;

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
