"use client";
import { CurrencyContext } from "@/app/context/CurrencyContext";
import { DateContext } from "@/app/context/DateContext";
import { useTranslations } from "next-intl";
import React, { useContext } from "react";

const TotalPrice = () => {
  const { totalPrice } = useContext(DateContext);
  const { currency, convertCurrency } = useContext(CurrencyContext);
  const t = useTranslations();

  const convertedTotalPrice = convertCurrency(
    totalPrice,
    "AED",
    currency
  ).toFixed(2);

  return (
    <div className="flex  items-start justify-center gap-2">
      <p className="font-bold text-xl">{t("translations.totalPrice")}</p>
      <p className="text-lg font-bold">
        {convertedTotalPrice + " " + currency}
      </p>
    </div>
  );
};

export default TotalPrice;
