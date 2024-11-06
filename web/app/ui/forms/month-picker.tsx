import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { months } from "@/lib/utils";

type MonthPickerProps = {
  value: string | number;
  onChange: (value: string) => void;
};

export const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  onChange,
}) => {
  const stringValue =
    typeof value === "number" ? value.toString().padStart(2, "0") : value;

  return (
    <Select value={stringValue} onValueChange={onChange}>
      <SelectTrigger className="w-full h-[42px] border-2 border-black rounded-xl bg-white">
        <SelectValue placeholder="Enter Month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month, index) => (
          <SelectItem
            key={index}
            value={(index + 1).toString().padStart(2, "0")}
          >
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
