"use client";
import { DateContext } from "@/app/context/DateContext";
import { useTranslations } from "next-intl";
import React, { useContext } from "react";

const TotalAccomodation = () => {
  const t = useTranslations();
  const { numberOfAttractions } = useContext(DateContext);
  return (
    <div className="flex  items-start justify-center gap-2">
      <p className="font-bold text-xl">{t("translations.totalAccomodation")}</p>
      <p className="font-bold text-xl">
        {numberOfAttractions + " " + t("translations.nights")}
      </p>
    </div>
  );
};

export default TotalAccomodation;
