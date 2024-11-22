"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const Outputs = ({ highPrice, lowPrice }: any) => {
  const [lowRate, setLowRate] = useState("");
  const [highRate, setHighRate] = useState("");
  const t = useTranslations();
  return (
    <div className="flex justify-center items-center gap-3">
      <div className="flex flex-col items-center">
        <p className=" font-bold text-lg">{t("translations.highPrice")}</p>
        <p className="text-lg text-blue-500">${highPrice}</p>
      </div>

      {/* Low Price */}
      <div className="flex flex-col items-center">
        <p className="text-lg font-bold">{t("translations.lowPrice")}</p>
        <p className="text-lg text-green-500">${lowPrice}</p>
      </div>

      {/* High Rate */}
      <div className="flex flex-col items-center">
        <p className="text-lg font-bold">{t("translations.highRate")}</p>
        <p className="text-lg text-yellow-500">+{highRate}</p>
      </div>

      {/* Low Rate */}
      <div className="flex flex-col items-center">
        <p className="text-lg font-bold">{t("translations.lowRate")}</p>
        <p className="text-lg text-red-500">+{lowRate}</p>
      </div>
    </div>
  );
};

export default Outputs;
