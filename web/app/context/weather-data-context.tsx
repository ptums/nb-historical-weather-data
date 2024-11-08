import { WeatherData } from "@/lib/types";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface WeatherDataContextType {
  weatherData: WeatherData[];
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData[]>>;
}

const WeatherDataContext = createContext<WeatherDataContextType | undefined>(
  undefined
);

export const WeatherDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  return (
    <WeatherDataContext.Provider value={{ weatherData, setWeatherData }}>
      {children}
    </WeatherDataContext.Provider>
  );
};

export const useWeatherData = (): WeatherDataContextType => {
  const context = useContext(WeatherDataContext);
  if (context === undefined) {
    throw new Error("useWeatherData must be used within a WeatherDataProvider");
  }
  return context;
};
