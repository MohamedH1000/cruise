import React from "react";
import ReservationTable from "./components/ReservationTable/ReservationTable";
import { getTranslations } from "next-intl/server";

const ReservationsPage = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let reservations = [];

  try {
    const response = await fetch(`${baseUrl}/api/reservation`, {
      cache: "no-store", // prevents caching for fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reservations: ${response.status}`);
    }

    reservations = await response.json();
  } catch (error) {
    console.error("Error fetching reservations:", error);
    // Handle the error appropriately in your UI if needed
  }

  const t = await getTranslations();

  return (
    <>
      <h1 className="font-bold text-3xl">جميع الحجوزات</h1>
      <ReservationTable data={reservations} />
    </>
  );
};

export default ReservationsPage;
