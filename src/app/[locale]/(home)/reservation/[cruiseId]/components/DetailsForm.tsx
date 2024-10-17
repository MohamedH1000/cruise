"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Calender from "./Calender";
import PhoneInput from "react-phone-number-input";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { addDays, differenceInDays } from "date-fns";

const DetailsForm = ({
  name,
  setName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  dateRange,
  setDateRange,
  disableDates,
  currentUser,
}: any) => {
  const t = useTranslations();
  return (
    <>
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="font-bold text-xl">
          {t("translations.completeData")}
        </div>
      </div>
      <Separator />
      <Calender
        value={dateRange}
        onChange={(ranges) => {
          const { startDate, endDate }: any = ranges.selection;

          // Calculate the number of days selected
          const daysDifference = differenceInDays(endDate, startDate);

          if (daysDifference > 5) {
            alert(t("translations.reserveLimitMax"));
            setDateRange({
              ...ranges.selection,
              endDate: addDays(startDate, 5),
            });
          } else if (daysDifference < 2) {
            alert(t("translations.reserveLimitMin"));
            setDateRange({
              ...ranges.selection,
              endDate: addDays(startDate, 2),
            });
          } else {
            setDateRange(ranges.selection);
          }
        }}
        disabledDates={disableDates}
      />
      {!currentUser ? (
        <>
          <Separator />
          <div className="flex flex-col px-4 py-4 gap-3">
            <h1 className="text-[30px] font-medium max-md:text-[20px]">
              {t("translations.userDetails")}
            </h1>
            <label htmlFor="name">{t("SignUp.name")}</label>
            <Input
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder={t("translations.fullName")}
              required
            />
            <label htmlFor="email">{t("Login.email")}</label>
            <Input
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Login.email")}
              required
            />
            <label htmlFor="phonenumber">{t("SignUp.phonenumber")}</label>
            <div dir="ltr">
              <PhoneInput
                name="phoneNumber"
                defaultCountry="US"
                international
                withCountryCallingCode
                onChange={(value: any) => setPhoneNumber(value)}
                placeholder={t("SignUp.phonenumber")}
                required
                className="border-[1px] border-[#003b95] p-3 rounded-md focus:outline-none !important"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="px-4 mb-5">
          <label htmlFor="phonenumber">
            {t("SignUp.phonenumber")} ({t("translations.mandatory")})
          </label>
          <div dir="ltr" className="mt-2">
            <PhoneInput
              name="phoneNumber"
              defaultCountry="US"
              international
              withCountryCallingCode
              onChange={(value: any) => setPhoneNumber(value)}
              placeholder={t("SignUp.phonenumber")}
              required
              className="border-[1px] border-[#003b95] p-3 rounded-md focus:outline-none !important"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DetailsForm;
