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
  const searchParams = useSearchParams();
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [rooms, setRooms] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const dateFromParam = searchParams.get("from");
    const dateToParam = searchParams.get("to");
    const adults = searchParams?.get("adults");
    const kids = searchParams?.get("kids");
    const rooms = searchParams?.get("rooms");

    const parsedFrom = dateFromParam ? parseISO(dateFromParam) : null;
    const parsedTo = dateToParam ? parseISO(dateToParam) : null;

    if (parsedFrom && !isNaN(parsedFrom.getTime())) {
      setDateRange((prev: any) => ({
        ...prev,
        from: parsedFrom,
      }));
    }
    if (parsedTo && !isNaN(parsedTo.getTime())) {
      setDateRange((prev: any) => ({
        ...prev,
        to: parsedTo,
      }));
    }

    if (adults) {
      setAdults(parseInt(adults));
    }

    if (kids) {
      setKids(parseInt(kids));
    }

    if (rooms) {
      setRooms(parseInt(rooms));
    }
  }, [searchParams, setDateRange]);

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
  const handleFromDateChange = (date: Date | null) => {
    if (date) {
      setDateRange((prev) => ({
        from: date,
        to: prev.to && prev.to > date ? prev.to : null, // Ensure "to" is after "from"
      }));
    } else {
      setDateRange((prev) => ({ ...prev, from: null, to: null }));
    }
  };

  const handleToDateChange = (date: Date | null) => {
    if (date) {
      const minDate = new Date(dateRange.from || 0);
      const maxDate = new Date(minDate);
      maxDate.setDate(minDate.getDate() + 6); // 6 days max

      if (date < minDate) {
        return; // Ignore if "to" date is before "from" date
      }

      if (date > maxDate) {
        return; // Ignore if "to" date exceeds 6 days
      }

      setDateRange((prev) => ({
        ...prev,
        to: date,
      }));
    } else {
      setDateRange((prev) => ({ ...prev, to: null }));
    }
  };

  const handleSearch = () => {
    // Construct the query parameters
    const query = new URLSearchParams();

    if (dateRange?.from)
      query.append("from", format(dateRange.from, "yyyy-MM-dd"));
    if (dateRange?.to) query.append("to", format(dateRange.to, "yyyy-MM-dd"));
    if (adults) query.append("adults", adults.toString());
    if (kids) query.append("kids", kids.toString());
    if (rooms) query.append("rooms", rooms.toString());

    // Navigate to /search with the constructed query string
    router.push(`/search?${query.toString()}`);
  };
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
      <h1 className="font-bold mt-5 mx-3">
        {t("translations.editReservation")}
      </h1>
      <div
        className={` text-black w-full bg-[#ffb700] h-[62px] rounded-[12px] p-1 flex gap-2 max-md:flex-col max-md:h-auto mt-5 mx-auto`}
      >
        {/* <Popover>
          <PopoverTrigger
            asChild
            className="bg-white border-none h-full rounded-[12px] flex-1 max-md:w-full"
          >
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span className="font-bold truncate">
                  {t("NavItems.PickDate")}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white rounded-[12px]"
            align="start"
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateChange} // Add custom logic
              numberOfMonths={2}
              dir="ltr"
              disabled={(date) =>
                disableDates?.some(
                  (disabledDate: Date) =>
                    disabledDate.toDateString() === date.toDateString()
                )
              }
            />
          </PopoverContent>
        </Popover> */}
        {/* From Date Picker */}
        <Popover>
          <PopoverTrigger
            asChild
            className="bg-white border-none h-full rounded-[12px] flex-1"
          >
            <Button
              id="from-date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal max-md:w-full",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                format(dateRange.from, "LLL dd, y")
              ) : (
                <span className="font-bold truncate">Select From Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white rounded-[12px]"
            align="start"
          >
            <Calendar
              initialFocus
              mode="single" // Single date selection for "from"
              selected={dateRange.from}
              onSelect={handleFromDateChange}
              disabled={(date) =>
                disableDates?.some(
                  (disabledDate: Date) =>
                    disabledDate.toDateString() === date.toDateString()
                )
              }
            />
          </PopoverContent>
        </Popover>

        {/* To Date Picker */}
        <Popover>
          <PopoverTrigger
            asChild
            className="bg-white border-none h-full rounded-[12px] flex-1"
          >
            <Button
              id="to-date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal max-md:w-full",
                !dateRange.to && "text-muted-foreground"
              )}
              disabled={!dateRange.from} // Disable "to" button until "from" is selected
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.to ? (
                format(dateRange.to, "LLL dd, y")
              ) : (
                <span className="font-bold truncate">Select To Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white rounded-[12px]"
            align="start"
          >
            <Calendar
              initialFocus
              mode="single" // Single date selection for "to"
              selected={dateRange.to}
              onSelect={handleToDateChange}
              disabled={(date) =>
                disableDates?.some(
                  (disabledDate: Date) =>
                    disabledDate.toDateString() === date.toDateString()
                )
              }
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger
            asChild
            className="bg-white border-none h-full rounded-[12px] flex-1 max-md:w-full"
          >
            <Button
              variant={"outline"}
              className={"w-[300px] justify-start text-left font-normal"}
            >
              <span className="font-bold truncate">
                {adults + " "}
                {t("NavItems.adults")}
                {" ," + kids + " "}
                {t("NavItems.kids")}
                {" ," + rooms + " "}
                {t("NavItems.rooms")}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[350px] p-4 bg-white rounded-[12px] max-w-[500px] max-sm:w-[225px]"
            align="start"
          >
            <div className="flex justify-between items-center">
              <p>{t("PopoverContent.adults")}</p>
              <AdultCounter adults={adults} setAdults={setAdults} />
            </div>
            <div className="flex justify-between items-center mt-5">
              <p>{t("PopoverContent.kids")}</p>
              <KidCounter kids={kids} setKids={setKids} />
            </div>
            <div className="flex justify-between items-center mt-5">
              <p>{t("PopoverContent.rooms")}</p>
              <RoomCounter rooms={rooms} setRooms={setRooms} />
            </div>
          </PopoverContent>
        </Popover>
        <Button
          className="h-full rounded-[12px] ml-auto w-[100px] max-md:w-full"
          onClick={handleSearch}
        >
          {t("Buttons.search")}
        </Button>
      </div>
    </>
  );
};

export default DetailsForm;
