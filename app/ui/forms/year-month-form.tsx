"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MonthPicker } from "./month-picker";
import { YearInput } from "./year-input";
import { useYearMonth } from "@/app/context/year-month-context";
import { Button } from "@/components/ui/button";
import { SiteTitle } from "../site-title";

const schema = yup.object().shape({
  month: yup
    .mixed()
    .test(
      "is-valid-month",
      'Month must be a number from 1 to 12 or a two-digit string from "01" to "12"',
      (value) => {
        console.log(
          "Month value being validated:",
          value,
          "Type:",
          typeof value
        );
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
  const { month, setMonth, year, setYear, setIsSubmitted, isSubmitted } =
    useYearMonth();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      month: "",
      year: year.toString() === "" ? undefined : year,
    },
  });

  const onSubmit = (data: FormData) => {
    setMonth(data.month as string);
    setYear(typeof data.year === "number" ? data.year : 1850);

    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <>
      <SiteTitle />
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="w-full sm:w-1/3">
            <MonthPicker
              value={month}
              onChange={(value) => {
                console.log("MonthPicker onChange:", value);
                setMonth(value);
                setValue("month", value, { shouldValidate: true });
              }}
            />
            {errors.month && (
              <p className="text-red-500 text-sm mt-1">
                {errors.month.message}
              </p>
            )}
          </div>
          <div className="w-full sm:w-1/3">
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
          <Button
            type="submit"
            disabled={isSubmitted}
            className="w-full sm:w-1/3 bg-green-400 hover:bg-green-500 text-black rounded-xl px-8 py-2 h-[42px]"
          >
            Go
          </Button>
        </form>
      </div>
    </>
  );
}
