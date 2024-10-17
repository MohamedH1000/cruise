"use client";
import { createContext, useEffect, useState } from "react";

export const CurrencyContext = createContext<any>(null);

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currency, setCurrency] = useState<any>(null);
  const rates = {
    AED: 1,
    USD: 0.272294,
    EUR: 0.251451,
    SAR: 1.02,
  };

  const convertCurrency = (amount, fromCurrency, toCurrency): any => {
    return (amount / rates[fromCurrency]) * rates[toCurrency];
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") || "AED";
    setCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    if (currency) {
      localStorage.setItem("currency", currency);
    }
  }, [currency]);

  if (currency === null) {
    return null; // Alternatively, you can render a loading indicator here
  }

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convertCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
