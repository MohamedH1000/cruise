"use client";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import AdultCounter from "@/components/NavBar/AdultCounter";
import KidCounter from "@/components/NavBar/KidCounter";
import RoomCounter from "@/components/NavBar/RoomCounter";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";

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

  // const handleDateChange = (newDateRange: DateRange | undefined) => {
  //   if (!newDateRange?.from || !newDateRange?.to) {
  //     setDateRange(newDateRange); // Update if no end date is selected yet
  //     return;
  //   }

  //   const { from, to } = newDateRange;
  //   const daysDifference = differenceInDays(to, from);

  //   if (daysDifference > 5) {
  //     alert(t("translations.reserveLimitMax"));
  //     setDateRange({
  //       from,
  //       to: addDays(from, 5), // Automatically set to a max of 5 days
  //     });
  //   } else if (daysDifference < 2) {
  //     alert(t("translations.reserveLimitMin"));
  //     setDateRange({
  //       from,
  //       to: addDays(from, 2), // Automatically set to a minimum of 2 days
  //     });
  //   } else {
  //     setDateRange(newDateRange); // Set the selected range if valid
  //   }
  // };

  return (
    <>
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="font-bold text-xl">
          {t("translations.completeData")}
        </div>
      </div>
      <Separator />
      {/* <Calender
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
      /> */}
    </>
  );
};

export default DetailsForm;
