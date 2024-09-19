"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname } from "next/navigation";

interface LanguageSelectorProps {
  isMobile: Boolean;
}
const LanguageSelector = ({ isMobile }: LanguageSelectorProps) => {
  const pathname = usePathname();
  const router = useRouter();
  // const localeURL = pathname?.split("/")[1];
  const remainingPath = pathname?.split("/").slice(2).join("/");
  // console.log(remainingPath);
  const t = useTranslations();
  const [isPending] = useTransition();
  const locale = useLocale();

  const handleSelect = (value: any) => {
    const current = value;
    router.push(`/${current}/${remainingPath}`);
  };

  return (
    <>
      <div
        className={`flex justify-center items-center gap-2 ${
          isMobile ? "sm:hidden" : "max-sm:hidden"
        }`}
      >
        <label
          className={`${isMobile ? "text-black" : "text-white"}`}
          htmlFor="language"
        >
          {t("chooselang.choose")}
        </label>
        <Select
          name="language"
          dir={locale === "ar" ? "rtl" : "ltr"}
          onValueChange={handleSelect}
          defaultValue={locale}
        >
          <SelectTrigger
            className={`${
              isMobile ? "text-black" : "text-white"
            } w-[150px] rounded-[10px]  max-md:w-[100px]`}
            disabled={isPending}
          >
            <SelectValue placeholder={t("chooselang.choose")} />
          </SelectTrigger>
          <SelectContent className="bg-white text-black rounded-md py-2 cursor-pointer z-[50]">
            <SelectItem value="ar" className="border-b-2 cursor-pointer">
              {t("chooselang.lang1")}
            </SelectItem>
            <SelectItem value="en" className="cursor-pointer">
              {t("chooselang.lang2")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default LanguageSelector;
