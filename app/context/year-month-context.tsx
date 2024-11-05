"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type YearMonthContextType = {
  month: string;
  setMonth: (month: string) => void;
  year: number;
  setYear: (year: number) => void;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
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
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  return (
    <YearMonthContext.Provider
      value={{ month, setMonth, year, setYear, isSubmitted, setIsSubmitted }}
    >
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
