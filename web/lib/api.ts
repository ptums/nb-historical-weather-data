import { PayloadTypes } from "./types";

export async function fetchMonthWeatherData(month: number, year: number) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/weather/month`;
  const payload = { month, year };

  return postResponse(url, payload);
}

export async function fetchTodayWeatherData() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/weather/today`;

  return getResponse(url);
}

export async function fetchMonthsYearsData(month: number, year: number) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/month-year/create`;

  const payload = { month, year };

  return postResponse(url, payload);
}

async function getResponse(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return [...data];
}

async function postResponse(url: string, payload: PayloadTypes) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return [...data];
}
