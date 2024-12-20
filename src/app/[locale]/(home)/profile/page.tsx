import { redirect } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/actions/user.action";
import React from "react";
import ProfileForm from "./components/ProfileForm";
import { getReservationsByUserId } from "@/lib/actions/reservation.action";

const page = async () => {
  const currentUser = await getCurrentUser();
  const reservationsByUser = await getReservationsByUserId(currentUser?.id);

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <div
      className="mt-[120px] lg:px-[180px]
  md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <ProfileForm
        currentUser={currentUser}
        reservationDetails={reservationsByUser}
      />
    </div>
  );
};

export default page;
