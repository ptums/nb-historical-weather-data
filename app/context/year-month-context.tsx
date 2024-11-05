"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type YearMonthContextType = {
  month: string;
  setMonth: (month: string) => void;
  year: number;
  setYear: (year: number) => void;
};

const YearMonthContext = createContext<YearMonthContextType | undefined>(
  undefined
);

interface YearMonthProviderProps {
  children: ReactNode;
}

export const YearMonthProvider: React.FC<YearMonthProviderProps> = ({
  children,
}) => {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  return (
    <YearMonthContext.Provider value={{ month, setMonth, year, setYear }}>
      {children}
    </YearMonthContext.Provider>
  );
};

export const useYearMonth = () => {
  const context = useContext(YearMonthContext);
  if (context === undefined) {
    throw new Error("useYearMonth must be used within a YearMonthProvider");
  }
  return context;
};
