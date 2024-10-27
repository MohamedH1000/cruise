"use client";
import React from "react";
import { CurrencyProvider } from "./CurrencyContext";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <CurrencyProvider>{children}</CurrencyProvider>;
};

export default ContextProvider;
