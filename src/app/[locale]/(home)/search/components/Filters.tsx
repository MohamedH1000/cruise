"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceFrom, setPriceFrom] = useState(searchParams?.get("from") || "");
  const [priceTo, setPriceTo] = useState(searchParams?.get("to") || "");
  const [selectedRate, setSelectedRate] = useState(
    searchParams?.get("rate") || null
  );
  const [filters, setFilters] = useState(() => {
    const initialFilters: any = {};
    [
      "offers",
      "freeParking",
      "freeInternet",
      "outdoorSeating",
      "indoorSeating",
      "dining",
      "includeBreak",
      "kitchen",
      "waching",
      "tv",
      "teaMaker",
      "roomService",
      "Jacuzzi",
      "messageChair",
      "accessible",
    ].forEach((key) => {
      initialFilters[key] = searchParams?.get(key) === "true";
    });
    return initialFilters;
  });

  const updateQueryParams = (key: string, value: string | boolean | null) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Price input change handlers
  const handlePriceFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceFrom(value);
    updateQueryParams("fromPrice", value);
  };

  const handlePriceToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceTo(value);
    updateQueryParams("toPrice", value);
  };

  const handleCheckboxToggle = (key: string) => {
    const updatedFilters = { ...filters, [key]: !filters[key] };
    setFilters(updatedFilters);
    updateQueryParams(key, updatedFilters[key]);
  };

  const handleRateClick = (rate: string) => {
    if (selectedRate === rate) {
      setSelectedRate(null);
      updateQueryParams("rate", null);
    } else {
      setSelectedRate(rate);
      updateQueryParams("rate", rate);
    }
  };
  const t = useTranslations();
  return (
    <div className="w-[46%] my-10 max-sm:w-full">
      <h1 className="font-bold text-3xl">{t("translations.filters")}</h1>
      <div className="w-full border-[1px] border-[black] rounded-md p-4 mt-3">
        <div className="flex justify-center items-center gap-5">
          <p className="font-bold">{t("cruisesTable.price")}</p>
          <div className="flex justify-center items-center gap-1">
            <div className="flex items-center gap-2">
              <p>{t("translations.from")}</p>
              <Input
                type="number"
                value={priceFrom}
                onChange={handlePriceFromChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <p>{t("translations.to")}</p>
              <Input
                type="number"
                value={priceTo}
                onChange={handlePriceToChange}
              />
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
        {Object.keys(filters).map((key) => (
          <div
            key={key}
            className="mt-2 flex justify-between gap-5 items-center px-10"
          >
            <p className="font-bold">{t(`translations.${key}`)}</p>
            <Checkbox
              checked={filters[key]}
              onCheckedChange={() => handleCheckboxToggle(key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filters;
