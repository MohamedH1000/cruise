"use client";
import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLocale, useTranslations } from "next-intl";
import locale from "date-fns/locale/af";
import { CurrencyContext } from "@/app/context/CurrencyContext";

interface CurrencySelectorProps {
  isMobile?: Boolean;
}
const CurrencySelector = ({ isMobile }: CurrencySelectorProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const { currency, setCurrency } = useContext(CurrencyContext);
  return (
    <>
      <div
        className={`flex flex-col justify-center items-start gap-2 ${
          isMobile ? "sm:hidden" : "max-sm:hidden"
        }`}
      >
        {isMobile && (
          <label
            className={`${isMobile ? "text-black" : "text-white"}`}
            htmlFor="language"
          >
            {t("translations.chooseCurrency")}
          </label>
        )}
        <Select
          name="currency"
          onValueChange={(value) => setCurrency(value)}
          dir={locale === "ar" ? "rtl" : "ltr"}
          defaultValue={currency}
        >
          <SelectTrigger
            className={`${
              isMobile ? "text-black" : "text-white"
            } w-[150px] rounded-[10px]  max-md:w-[100px]`}
          >
            <SelectValue placeholder={t("chooselang.choose")} />
          </SelectTrigger>
          <SelectContent
            className="bg-white text-black rounded-md py-2 cursor-pointer "
            ref={(ref) => {
              if (!ref) return;
              ref.ontouchend = (e) => e.preventDefault();
            }}
          >
            <SelectItem value="AED" className="border-b-2 cursor-pointer">
              AED
            </SelectItem>
            <SelectItem value="USD" className="cursor-pointer border-b-2">
              USD
            </SelectItem>
            <SelectItem value="SAR" className="cursor-pointer border-b-2">
              SAR
            </SelectItem>
            <SelectItem value="EUR" className="cursor-pointer">
              EUR
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default CurrencySelector;
