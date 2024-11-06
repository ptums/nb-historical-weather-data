import { SITE_DEFAULTS } from "@/lib/constants";
import React from "react";
import DarkModeToggle from "./dark-mode";
import classNames from "classnames";
import { useDarkMode } from "../context/dark-mode-context";

export const SiteTitle = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex flex-row space-between">
      <h1
        className={classNames(
          "text-4xl mb-8 text-center font-['Comic_Sans_MS']",
          {
            "text-black": !isDarkMode,
            "text-yellow-50": isDarkMode,
          }
        )}
      >
        {SITE_DEFAULTS.title}
      </h1>
      <DarkModeToggle />
    </div>
  );
};
