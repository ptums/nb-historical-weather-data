import { SITE_DEFAULTS } from "@/lib/constants";
import React from "react";
import ToggleFetchToggle from "./toggle-fetch";

export const SiteTitle = () => {
  return (
    <div className="flex flex-row space-between">
      <h1 className="text-4xl mb-8 text-center font-['Comic_Sans_MS'] text-black">
        {SITE_DEFAULTS.title}
      </h1>
      <ToggleFetchToggle />
    </div>
  );
};
