"use client";
import { createContext, useEffect, useState } from "react";

export const CurrencyContext = createContext<any>(null);

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currency, setCurrency] = useState<any>(null);
  const [rates, setRates] = useState({
    AED: 1,
    USD: 0.272294,
    EUR: 0.251451,
    SAR: 1.02,
  });

  const fetchRates = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/AED"
      ); // Replace with your API URL
      const data = await response.json();
      const latestRates = {
        AED: 1, // Base currency
        USD: data.rates.USD,
        EUR: data.rates.EUR,
        SAR: data.rates.SAR,
      };
      setRates(latestRates);
    } catch (error) {
      console.error("Failed to fetch exchange rates", error);
    }
  };

  useEffect(() => {
    // Fetch rates on component mount or periodically
    fetchRates();
  }, []);
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
