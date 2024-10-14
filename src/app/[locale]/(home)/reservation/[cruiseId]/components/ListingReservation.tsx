"use client";
import { Range } from "react-date-range";

import React, { useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import "react-phone-number-input/style.css";

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import DetailsForm from "./DetailsForm";
import AttractionForm from "./AttractionForm";
import RestaurantForm from "./RestaurantForm";
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

enum STEPS {
  DATA = 0,
  ATTRACTIONS = 1,
  RESTAURANTS = 2,
}
const ListingReservation = ({
  reservations,
  currentUser,
  cruise,
  attractions,
}: any) => {
  const initialOptions = attractions.map((attraction: any) => attraction.name);
  const t = useTranslations();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState(initialOptions);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [totalPrice, setTotalPrice] = useState<any>();
  const [numberOfAttractions, setNumberOfAttractions] = useState<any>();
  const [steps, setSteps] = useState(STEPS.DATA);

  const onBack = () => {
    setSteps((value) => value - 1);
  };

  const onNext = () => {
    setSteps((value) => value + 1);
  };

  const actionLabel = useMemo(() => {
    if (steps === STEPS.RESTAURANTS) {
      return t("translations.reservenow");
    }
    return t("translations.next");
  }, [steps]);

  const secondaryActionLabel = useMemo(() => {
    if (steps === STEPS.DATA) {
      return undefined;
    }

    return t("translations.previous");
  }, [steps]);
  // console.log(numberOfAttractions);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount =
        differenceInCalendarDays(dateRange.endDate, dateRange.startDate) + 1;

      let newTotalPrice: number = 0;

      if (dayCount && cruise.price) {
        newTotalPrice = dayCount * cruise?.price;
      } else {
        newTotalPrice = cruise.price;
      }

      setTotalPrice(newTotalPrice);
      setNumberOfAttractions(dayCount + 1);
    }
  }, [dateRange, cruise?.price]);

  const disableDates = useMemo(() => {
    let dates: Date[] = [];
    reservations
      ?.filter((res: any) => res.status !== "canceled")
      .forEach((reservations: any) => {
        const range = eachDayOfInterval({
          start: new Date(reservations.startDate),
          end: new Date(reservations.endDate),
        });
        dates = [...dates, ...range];
      });
    return dates;
  }, [reservations]);

  const onSubmit = async () => {};
  return (
    <motion.div
      className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden mt-5 w-full"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 100, y: 0 }}
      transition={{ duration: 1, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">SAR {cruise?.price}</div>
        <div className="font-light text-neutral-600">
          {t("translations.pernight")}
        </div>
      </div>
      <Separator />
      {steps === STEPS.DATA && (
        <DetailsForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          dateRange={dateRange}
          setDateRange={setDateRange}
          disableDates={disableDates}
          currentUser={currentUser}
        />
      )}

      {steps === STEPS.ATTRACTIONS && (
        <AttractionForm
          numberOfAttractions={numberOfAttractions}
          availableOptions={availableOptions}
          setAvailableOptions={setAvailableOptions}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
      )}

      {steps === STEPS.RESTAURANTS && <RestaurantForm />}

      <Separator />
      <div className="p-4 flex justify-center items-center gap-2">
        {secondaryActionLabel && (
          <Button
            onClick={onBack}
            disabled={isLoading ? true : false}
            className="w-full rounded-md bg-[#003b95]
          text-white border-[#003b95] hover:border-[1px] hover:bg-white 
          hover:text-[#003b95] transtion duration-300 font-bold"
          >
            {secondaryActionLabel}
            {/* {isLoading ? "برجاء الانتظار" : "قم بالحجز"} */}
          </Button>
        )}

        <Button
          onClick={actionLabel === t("translations.next") ? onNext : onSubmit}
          disabled={isLoading ? true : false}
          className="w-full rounded-md bg-[#003b95]
        text-white border-[#003b95] hover:border-[1px] hover:bg-white 
        hover:text-[#003b95] transtion duration-300 font-bold"
        >
          {actionLabel}
          {/* {isLoading ? "برجاء الانتظار" : "قم بالحجز"} */}
        </Button>
      </div>
      <div className="p-4 flex flex-row  items-center justify-between font-semibold text-lg">
        <div className="font-bold capitalize">{t("translations.total")}:</div>
        <div>SAR {totalPrice}</div>
      </div>
    </motion.div>
  );
};

export default ListingReservation;
