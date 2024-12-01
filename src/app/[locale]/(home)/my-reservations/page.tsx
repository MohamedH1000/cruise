import React from "react";

import { getTranslations } from "next-intl/server";
import MyReservationTable from "./components/MyReservationTable";
import { getReservationsByUserId } from "@/lib/actions/reservation.action";
import { getCurrentUser } from "@/lib/actions/user.action";

const ReservationsPage = async () => {
  const t = await getTranslations();
  const currentUser = await getCurrentUser();
  const getReservations = await getReservationsByUserId(currentUser?.id);
  const { reservations } = getReservations;
  // console.log(reservations);

  return (
    <div
      className="mt-[120px] lg:px-[180px]
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <h1 className="font-bold text-3xl">جميع الحجوزات</h1>
      <MyReservationTable data={reservations} />
    </div>
  );
};

export default ReservationsPage;
