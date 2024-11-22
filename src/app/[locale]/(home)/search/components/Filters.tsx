"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const Filters = () => {
  const [selectedRate, setSelectedRate] = useState(null);

  const handleRateClick = (rate: any) => {
    // Toggle selection: if the same rate is clicked, deselect it
    if (selectedRate === rate) {
      setSelectedRate(null); // Deselect
    } else {
      setSelectedRate(rate); // Select the clicked rate
    }
  };
  const t = useTranslations();
  return (
    <div className="w-full my-10">
      {" "}
      <h1 className="font-bold text-3xl">{t("translations.filters")}</h1>
      <div className="w-full border-[1px] border-[black]  rounded-md p-4 mt-3">
        <div className="flex justify-center items-center gap-5">
          <p className="font-bold">{t("cruisesTable.price")}</p>
          <div className="flex justify-center items-center gap-1">
            <div className="flex items-center gap-2">
              <p>{t("translations.from")}</p>
              <Input type="number" />
            </div>
            <div className="flex items-center gap-2">
              <p>{t("translations.to")}</p>
              <Input type="number" />
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-center gap-5 items-center">
          <p className="font-bold">{t("translations.voting")}</p>
          <div className="flex gap-2">
            {["+6", "+7", "+8", "+9"].map((rate) => (
              <div
                key={rate}
                className={`w-10 h-10 flex justify-center items-center rounded-full border-2 ${
                  selectedRate === rate
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                } cursor-pointer`}
                onClick={() => handleRateClick(rate)}
              >
                {rate}
              </div>
            ))}
          </div>
        </div>
        <Separator className="mt-5" />
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.offers")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.freeParking")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.freeInternet")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.outdoorSeating")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.indoorSeating")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.dining")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.includeBreak")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.kitchen")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.waching")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.tv")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.teaMaker")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.roomService")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.Jacuzzi")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.messageChair")}</p>
          <Checkbox />
        </div>
        <div className="mt-2 flex justify-between gap-5 items-center px-10">
          <p className="font-bold">{t("translations.accessible")}</p>
          <Checkbox />
        </div>
      </div>
    </div>
  );
};

export default Filters;
