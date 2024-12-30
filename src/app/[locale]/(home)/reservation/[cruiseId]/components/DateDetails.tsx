"use client";

import { DateContext } from "@/app/context/DateContext";
import { useTranslations } from "next-intl";
import React, { useContext } from "react";

const DateDetails = () => {
  const t = useTranslations();
  const { dateDetails } = useContext(DateContext);
  console.log(dateDetails);
  return (
    <>
      {/* arrival day */}
      <div className="flex justify-center items-start gap-4">
        <div className="flex items-start justify-center gap-2">
          <p className="font-bold text-xl">{t("translations.arrivalDay")}</p>
          <p className="font-bold text-lg">{dateDetails.from.dayName}</p>
        </div>
        <div className="flex items-start justify-center gap-2">
          <p className="font-bold text-xl">{t("translations.Date")}</p>
          <p className="font-bold text-lg">{dateDetails.from.date}</p>
        </div>
        <div className="flex items-start justify-center gap-2">
          <p className="font-bold text-xl">{t("translations.time")}</p>
          <p className="font-bold text-lg">{dateDetails.from.time}</p>
        </div>
      </div>
      {/* Leave Date */}
      <div className="flex justify-center items-start gap-4">
        <div className="flex items-start justify-center gap-2">
          <p className="font-bold text-xl">{t("translations.leaveDay")}</p>
          <p className="font-bold text-lg">{dateDetails.to.dayName}</p>
        </div>
        <div className="flex items-start justify-center gap-2">
          <p className="font-bold text-xl">{t("translations.Date")}</p>
          <p className="font-bold text-lg">{dateDetails.to.date}</p>
        </div>
        <div className="flex items-start justify-center gap-2">
          <p className="font-bold text-xl">{t("translations.time")}</p>
          <p className="font-bold text-lg">{dateDetails.to.time}</p>
        </div>
      </div>
    </>
  );
};

export default DateDetails;
