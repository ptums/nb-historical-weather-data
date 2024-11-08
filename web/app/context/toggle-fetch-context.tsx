"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ToggleFetchContextType = {
  isToggleFetch: boolean;
  toggleToggleFetch: () => void;
  isDisplayToggleFetch: boolean;
  toggleDisplayToggleFetch: () => void;
};

const ToggleFetchContext = createContext<ToggleFetchContextType | undefined>(
  undefined
);

export function ToggleFetchProvider({ children }: { children: ReactNode }) {
  const [isToggleFetch, setIsToggleFetch] = useState(false);
  const [isDisplayToggleFetch, setIsDisplayToggleFetch] = useState(false);

  useEffect(() => {
    if (isToggleFetch) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isToggleFetch]);

  const toggleToggleFetch = () => {
    setIsToggleFetch((prev) => !prev);
  };

  const toggleDisplayToggleFetch = () => {
    setIsDisplayToggleFetch((prev) => !prev);
  };

  return (
    <ToggleFetchContext.Provider
      value={{
        isToggleFetch,
        toggleToggleFetch,
        isDisplayToggleFetch,
        toggleDisplayToggleFetch,
      }}
    >
      {children}
    </ToggleFetchContext.Provider>
  );
}

export function useToggleFetch() {
  const context = useContext(ToggleFetchContext);
  if (context === undefined) {
    throw new Error("useToggleFetch must be used within a ToggleFetchProvider");
  }
  return context;
}
