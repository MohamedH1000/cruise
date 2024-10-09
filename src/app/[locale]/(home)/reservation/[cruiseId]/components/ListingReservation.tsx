"use client";
import { Range } from "react-date-range";

import React, { useEffect, useMemo, useState } from "react";
import Calender from "./Calender";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useTranslations } from "next-intl";
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};
const ListingReservation = ({ reservations, currentUser, cruise }: any) => {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [totalPrice, setTotalPrice] = useState<any>();
  const [numberOfAttractions, setNumberOfAttractions] = useState<any>();
  console.log(numberOfAttractions);

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
  return (
    <motion.div
      className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden mt-5 w-full"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 100, y: 0 }}
      transition={{ duration: 1, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">SAR {cruise.price}</div>
        <div className="font-light text-neutral-600">
          {t("translations.pernight")}
        </div>
      </div>
      <Separator />
      <Calender
        value={dateRange}
        onChange={(value) => {
          setDateRange(value.selection);
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
                className="border-[1px] border-[#bda069] p-3 rounded-md focus:outline-none !important"
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
              className="border-[1px] border-[#bda069] p-3 rounded-md focus:outline-none !important"
            />
          </div>
        </div>
      )}

      <Separator />
      <div className="p-4">
        {/* <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isLoading ? true : false}
              label="Reserve"
              className="w-full rounded-md bg-[#bda069]
        text-white border-[#bda069] hover:border-[1px] hover:bg-white 
        hover:text-[#bda069] transtion duration-300 font-bold"
            >
              {isLoading ? "برجاء الانتظار" : "قم بالحجز"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="flex flex-col items-start">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-start">
                بيانات الحجز
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="flex justify-between items-center gap-5">
                  <div className="text-right">
                    <h1>من تاريخ:</h1>
                    <p>{dateRange?.startDate?.toString()}</p>
                  </div>
                  <div className="text-right">
                    <h1>الى تاريخ:</h1>
                    <p>{dateRange?.endDate?.toString()}</p>
                  </div>
                </div>
                <Separator className="mt-5" />
                <div className="flex flex-col items-start w-full">
                  <div className="flex justify-between items-center w-full mt-2">
                    {servicePrice.chairPrice > 0 && (
                      <>
                        <h1>كراسي حفلات</h1>
                        <p>{servicePrice.chairPrice * 200} SAR</p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center w-full mt-2">
                    {servicePrice.coffeePrice > 0 && (
                      <>
                        <h1>ضيافة قهوة</h1>
                        <p>{servicePrice.coffeePrice * 250} SAR</p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center w-full mt-2">
                    {servicePrice.sweetPrice > 0 && (
                      <>
                        <h1>ضيافة حلى</h1>
                        <p>{servicePrice.sweetPrice * 150} SAR</p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center w-full mt-2">
                    {servicePrice.tablePrice > 0 && (
                      <>
                        <h1>سفرة طعام</h1>
                        <p>{servicePrice.tablePrice * 100} SAR</p>
                      </>
                    )}
                  </div>
                  {servicePrice.chairPrice === 0 &&
                    servicePrice.sweetPrice === 0 &&
                    servicePrice.tablePrice === 0 &&
                    servicePrice.coffeePrice === 0 && (
                      <div className="mb-5">لم يتم اضافة خدمات اضافية</div>
                    )}
                  <Separator />
                  <div className="mt-5 flex justify-between items-center w-full">
                    <h1>المجموع</h1>
                    <p>{totalPrice} SAR</p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-5 max-md:flex-col max-md:gap-2 rounded-md">
              <AlertDialogAction onClick={onSubmit}>تاكيد</AlertDialogAction>
              <AlertDialogCancel>الغاء</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
      <div className="p-4 flex flex-row  items-center justify-between font-semibold text-lg">
        <div className="font-bold capitalize">{t("translations.total")}:</div>
        <div>SAR {totalPrice}</div>
      </div>
    </motion.div>
  );
};

export default ListingReservation;
