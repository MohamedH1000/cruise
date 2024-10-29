import React from "react";
import ReservationTable from "./components/ReservationTable/ReservationTable";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/reservation`, {
    cache: "no-store", // prevents caching for fresh data on each request
  });

  const reservations = (await response.json()) || [];
  const t = await getTranslations();
  // console.log(cruises);
  return (
    <>
      <h1 className="font-bold text-3xl">جميع الحجوزات</h1>
      <ReservationTable data={reservations} />
    </>
  );
};

export default page;
