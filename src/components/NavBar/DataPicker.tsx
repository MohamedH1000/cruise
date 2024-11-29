"use client";
import React, { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import AdultCounter from "./AdultCounter";
import KidCounter from "./KidCounter";
import RoomCounter from "./RoomCounter";
import { useRouter } from "@/i18n/routing";

const DataPicker = ({ searchPage }: any) => {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(0);
  const [kids, setKids] = useState(0);
  const [rooms, setRooms] = useState(0);
  const t = useTranslations();

  const handleSearch = () => {
    // Construct the query parameters
    const query = new URLSearchParams();

    if (date?.from) query.append("from", format(date.from, "yyyy-MM-dd"));
    if (date?.to) query.append("to", format(date.to, "yyyy-MM-dd"));
    if (adults) query.append("adults", adults.toString());
    if (kids) query.append("kids", kids.toString());
    if (rooms) query.append("rooms", rooms.toString());

    // Navigate to /search with the constructed query string
    router.push(`/search?${query.toString()}`);
  };
  // ${
  //   searchPage ? "max-w-[650px]" : "max-w-[1000px]"
  // }
  return (
    <div
      className={`max-w-[1000px] text-black w-[90%]  bg-[#ffb700] h-[62px] rounded-[12px] p-1 flex gap-2 max-md:flex-col max-md:h-auto`}
    >
      <Popover>
        <PopoverTrigger
          asChild
          className="bg-white border-none h-full rounded-[12px] flex-1 max-md:w-full"
        >
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
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
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
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
  );
};

export default DataPicker;
