import { getCruiseById } from "@/lib/actions/cruise.action";
import React from "react";
import ImageGallery from "./components/ImageGallery";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ListingReservation from "./components/ListingReservation";
import { getAllReservations } from "@/lib/actions/reservation.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getAllAttractionsTable } from "@/lib/actions/attraction.action";
import dynamic from "next/dynamic";
const MapDisplay = dynamic(() => import("./components/MapDisplay"), {
  ssr: false,
});

const page = async ({ params }: any) => {
  const cruise = await getCruiseById(params.cruiseId);
  const reservations = await getAllReservations();
  const attractions = await getAllAttractionsTable();
  const currentUser = await getCurrentUser();
  const t = await getTranslations();
  //   console.log(cruise);
  return (
    <div
      className="mt-[130px] lg:px-[180px]
  md:px-[50px] max-sm:px-[10px] max-md:px-[50px] mb-10"
    >
      <h1 className="font-bold text-4xl">{cruise?.name}</h1>
      <ImageGallery images={cruise?.imageSrc} />
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
        {/* first col */}
        <div>
          <div className="mt-5 text-xl flex items-center gap-2">
            <p>
              {t("translations.createdBy")} :{" "}
              <span className="font-bold">{cruise?.user?.name}</span>
            </p>
            <Avatar>
              <AvatarImage src={cruise?.user?.image} />
              <AvatarFallback>{cruise?.user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <Separator className="mt-5" />
          <p className="font-semibold text-2xl opacity-85 my-10">
            {cruise?.description}
          </p>
          <Separator className="mt-5" />
          <h1 className="font-bold text-2xl mt-5">
            {t("translations.location")}
          </h1>
          <MapDisplay cruise={cruise} />
        </div>
        {/* second col */}
        <div className="w-full">
          <ListingReservation
            reservations={reservations}
            currentUser={currentUser}
            cruise={cruise}
            attractions={attractions}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
