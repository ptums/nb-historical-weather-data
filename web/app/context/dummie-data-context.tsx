"use client";

import { DUMMIE_DATA_FLAG } from "@/lib/constants";
import React, { createContext, useContext, useState, ReactNode } from "react";

type DummieDataContextType = {
  isDummieData: boolean;
  toggleDummieData: () => void;
};

const DummieDataContext = createContext<DummieDataContextType | undefined>(
  undefined
);

export function DummieDataProvider({ children }: { children: ReactNode }) {
  const [isDummieData, setIsDummieData] = useState(DUMMIE_DATA_FLAG);

  const toggleDummieData = () => {
    setIsDummieData((prev) => !prev);
  };

  return (
    <DummieDataContext.Provider value={{ isDummieData, toggleDummieData }}>
      {children}
    </DummieDataContext.Provider>
  );
}

export function useDummieData() {
  const context = useContext(DummieDataContext);
  if (context === undefined) {
    throw new Error("useDummieData must be used within a DummieDataProvider");
  }
  return context;
}
