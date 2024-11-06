"use client";

import React from "react";
import { useDarkMode } from "@/app/context/dark-mode-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import classNames from "classnames";

const Text = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const textClassnames = classNames({
    "text-black": !isDarkMode,
    "text-yellow-50": isDarkMode,
  });

  if (isDarkMode) {
    return <span className={textClassnames}>Dark Mode</span>;
  }

  return <span className={textClassnames}>Light Mode</span>;
};

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode"
        checked={isDarkMode}
        onCheckedChange={toggleDarkMode}
      />
      <Label htmlFor="dark-mode" className="flex items-center space-x-2">
        {isDarkMode ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        <Text isDarkMode={isDarkMode} />
      </Label>
    </div>
  );
}
