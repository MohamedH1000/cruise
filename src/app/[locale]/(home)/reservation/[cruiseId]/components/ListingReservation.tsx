"use client";
import { Range } from "react-date-range";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import "react-phone-number-input/style.css";

import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import DetailsForm from "./DetailsForm";
import AttractionForm from "./AttractionForm";
import RestaurantForm from "./RestaurantForm";
import { CurrencyContext } from "@/app/context/CurrencyContext";
import { fetchRestaurantsByAttractions } from "@/lib/actions/restaurant.action";
import { loadStripe } from "@stripe/stripe-js";
import { Restaurant } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import { Input } from "@/components/ui/input";
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
  const [name, setName] = useState(currentUser?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState(currentUser?.email || "");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState(initialOptions);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [totalPrice, setTotalPrice] = useState<any>();
  const [numberOfAttractions, setNumberOfAttractions] = useState<any>();
  const [steps, setSteps] = useState(STEPS.DATA);
  const [relatedRestaurants, setRelatedRestaurants] = useState([]);
  const { convertCurrency, currency } = useContext(CurrencyContext);
  // console.log(totalPrice);

  const openDialog = () => setIsDialogOpen(true);

  const closeDialog = () => setIsDialogOpen(false);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
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

  useEffect(() => {
    if (selectedOptions.length > 0) {
      // Fetch related restaurants based on the selected attractions
      const fetchRestaurants = async () => {
        const restaurants: Restaurant[] = await fetchRestaurantsByAttractions(
          selectedOptions
        );
        setRelatedRestaurants(restaurants);
      };

      fetchRestaurants();
    }
  }, [selectedOptions]);

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

  const convertedTotalPrice = convertCurrency(totalPrice, "AED", currency);
  const convertedPrice = convertCurrency(cruise?.price, "AED", currency);

  const onSubmit = async () => {
    if (!name || !phoneNumber) {
      alert("Please fill out all required fields");
      return;
    }
    setIsLoading(true);
    const stripe = await stripePromise;

    try {
      // Step 1: Create reservation with "pending" status
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          dateRange,
          status: "pending",
          totalPrice: Math.round(convertedTotalPrice * 100),
          currency: localStorage.getItem("currency") || "AED",
          cruiseId: cruise?.id,
          userId: currentUser?.id,
          attractions: selectedOptions,
        }),
      });

      const reservation = await response.json();

      if (reservation?.id) {
        // Step 2: Initiate Stripe checkout session with reservation ID
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: reservation.totalPrice, // total price in smallest unit
            currency: reservation.currency,
            reservationId: reservation.id, // Pass reservation ID to session
          }),
        });

        const session = await response.json();

        if (session.id) {
          // Step 3: Update reservation with session ID
          await fetch(`/api/reservation/`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reservId: reservation.id, // Ensure this ID is passed to locate the reservation
              sessionId: session.id,
            }),
          });
          const result = await stripe?.redirectToCheckout({
            sessionId: session.id,
          });

          if (result?.error) {
            console.error(result.error.message);
            // Optionally, update reservation status to "failed" on error
          }
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsLoading(false);
      closeDialog();
    }
  };

  const onPreSubmit = () => {
    openDialog();
  };

  return (
    <motion.div
      className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden mt-5 w-full"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 100, y: 0 }}
      transition={{ duration: 1, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">
          {currency} {convertedPrice}
        </div>
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

      {steps === STEPS.RESTAURANTS && (
        <RestaurantForm
          relatedRestaurants={relatedRestaurants}
          setTotalPrice={setTotalPrice}
        />
      )}

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
          onClick={
            actionLabel === t("translations.next") ? onNext : onPreSubmit
          }
          disabled={isLoading ? true : false}
          className="w-full rounded-md bg-[#003b95]
        text-white border-[#003b95] hover:border-[1px] hover:bg-white 
        hover:text-[#003b95] transtion duration-300 font-bold"
        >
          {actionLabel}
          {/* {isLoading ? "برجاء الانتظار" : "قم بالحجز"} */}
        </Button>
        <Dialog open={isDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("translations.enterDetails")}</DialogTitle>
            </DialogHeader>
            {!currentUser ? (
              <div className="flex flex-col">
                <Input
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("translations.fullName")}
                  required
                />
                <Input
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("Login.email")}
                  required
                />
                <label htmlFor="phonenumber">
                  {t("SignUp.phonenumber")} ({t("translations.mandatory")})
                </label>
                <div dir="ltr" className="mt-2">
                  <PhoneInputWithCountrySelect
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
            ) : (
              <div className="flex flex-col">
                <label htmlFor="phonenumber">
                  {t("SignUp.phonenumber")} ({t("translations.mandatory")})
                </label>
                <div dir="ltr" className="mt-2">
                  <PhoneInputWithCountrySelect
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

            <DialogFooter className="flex gap-3 items-center justify-end">
              <Button onClick={onSubmit} disabled={isLoading}>
                {t("translations.checkout")}
              </Button>
              <Button onClick={closeDialog}>{t("cruisesTable.cancel")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-4 flex flex-row  items-center justify-between font-semibold text-lg">
        <div className="font-bold capitalize">{t("translations.total")}:</div>
        <div>
          {currency} {convertedTotalPrice.toFixed(2)}
        </div>
      </div>
    </motion.div>
  );
};

export default ListingReservation;
