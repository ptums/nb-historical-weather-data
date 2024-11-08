"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MonthPicker } from "./month-picker";
import { YearInput } from "./year-input";
import { useYearMonth } from "@/app/context/year-month-context";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { fetchMonthWeatherData } from "@/lib/utils";
import { useWeatherData } from "@/app/context/weather-data-context";
import { WeatherData } from "@/lib/types";

const schema = yup.object().shape({
  month: yup
    .mixed()
    .test(
      "is-valid-month",
      'Month must be a number from 1 to 12 or a two-digit string from "01" to "12"',
      (value) => {
        if (typeof value === "string") {
          return /^(0[1-9]|1[0-2])$/.test(value);
        }
        if (typeof value === "number") {
          return value >= 1 && value <= 12;
        }
        return false;
      }
    )
    .required("Month is required"),
  year: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Year is required")
    .min(1850, "Year must be 1850 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

type FormData = yup.InferType<typeof schema>;

export function YearMonthForm() {
  const { month, setMonth, year, setYear, isSubmitted } = useYearMonth();
  const { setWeatherData } = useWeatherData();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      month: "01",
      year: 1950,
    },
  });

  const mutation = useMutation<
    WeatherData[],
    Error,
    { month: number; year: number }
  >({
    mutationFn: ({ month, year }) => fetchMonthWeatherData(month, year),
    onSuccess: (data) => {
      console.log("Weather data fetched successfully");
      setWeatherData(data as WeatherData[]);
      // You can do something with the data here, like updating state or context
    },
    onError: (error) => {
      console.error("Error fetching weather data:", error);
      // You can handle the error here, like showing an error message
    },
  });

  const onSubmit = (data: FormData) => {
    setMonth(data.month as string);
    setYear(typeof data.year === "number" ? data.year : 1850);

    if (data.month && data.year) {
      mutation.mutate({ month: parseInt(month), year });
    }

    // mutation.mutate();
  };

  return (
    <div className="w-full sm:w-3/4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="w-full sm:w-44">
          <MonthPicker
            value={month}
            onChange={(value) => {
              setMonth(value);
              setValue("month", value, { shouldValidate: true });
            }}
          />
          {errors.month && (
            <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
          )}
        </div>
        <div className="w-full sm:w-32">
          <YearInput
            value={year}
            onChange={(value) => {
              setYear(value);
              setValue("year", value, { shouldValidate: true });
            }}
            min={1850}
            max={new Date().getFullYear()}
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>
        <Button disabled={true} variant="compare">
          Compare
        </Button>
        <Button type="submit" disabled={isSubmitted} variant="go">
          Go
        </Button>
      </form>
    </div>
  );
}
