"use client";
import { createContext, useEffect, useState } from "react";

export const DateContext = createContext<any>(null);
const initialDateRange = {
  from: new Date(),
  to: new Date(),
  key: "selection",
};
export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [dateRange, setDateRange] = useState<any>(initialDateRange);
  const [totalPrice, setTotalPrice] = useState<any>();
  const [dateDetails, setDateDetails] = useState<any>();
  const [numberOfAttractions, setNumberOfAttractions] = useState<any>();
  useEffect(() => {
    function extractDateDetails(dateRange: any) {
      const formatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long", // Day name (e.g., "Monday")
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // 12-hour format
      });

      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);

      const details = {
        from: {
          dayName: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
            fromDate
          ),
          date: fromDate.toISOString().split("T")[0], // Extracts the date as YYYY-MM-DD
          time: fromDate.toTimeString().split(" ")[0], // Extracts the time as HH:MM:SS
        },
        to: {
          dayName: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
            toDate
          ),
          date: toDate.toISOString().split("T")[0], // Extracts the date as YYYY-MM-DD
          time: toDate.toTimeString().split(" ")[0], // Extracts the time as HH:MM:SS
        },
      };

      return details;
    }

    const result = extractDateDetails(dateRange);

    setDateDetails(result);
  }, []);
  return (
    <DateContext.Provider
      value={{
        dateRange,
        setDateRange,
        totalPrice,
        setTotalPrice,
        numberOfAttractions,
        setNumberOfAttractions,
        dateDetails,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};
