"use client";
import React from "react";
import { CurrencyProvider } from "./CurrencyContext";
import { DateProvider } from "./DateContext";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CurrencyProvider>
      <DateProvider>{children}</DateProvider>
    </CurrencyProvider>
  );
};

export default ContextProvider;
