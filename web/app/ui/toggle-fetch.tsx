"use client";

import React from "react";
import { useToggleFetch } from "@/app/context/toggle-fetch-context";

import { Moon, Sun } from "lucide-react";
import classNames from "classnames";

export default function ToggleFetchToggle() {
  const { isToggleFetch, toggleToggleFetch, isDisplayToggleFetch } =
    useToggleFetch();

  return (
    <div
      className={classNames("items-center space-x-2", {
        "absolute top-4 right-4 z-10": isDisplayToggleFetch,
        hidden: !isDisplayToggleFetch,
      })}
    >
      <button onClick={toggleToggleFetch}>
        {isToggleFetch ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
