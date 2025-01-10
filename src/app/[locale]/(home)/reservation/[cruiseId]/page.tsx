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
import DataPicker from "./components/DataPicker";
import Location from "./components/Location";
import TotalPrice from "./components/TotalPrice";
import TotalAccomodation from "./components/TotalAccomodation";
import DateDetails from "./components/DateDetails";

const page = async ({ params }: any) => {
  const cruise = await getCruiseById(params.cruiseId);
  const reservations = await getAllReservations();
  const attractions = await getAllAttractionsTable();
  // const combinedAttractions = await getCombinedAttractionsByRestaurantArray();
  const currentUser = await getCurrentUser();
  const t = await getTranslations();

  // console.log(cruise);
  return (
    <div
      className="mt-[130px] lg:px-[180px]
  md:px-[50px] max-sm:px-[10px] max-md:px-[50px] mb-10"
    >
      <h1 className="font-bold text-4xl">{cruise?.name}</h1>
      <ImageGallery images={cruise?.imageSrc} />
      <DataPicker reservations={reservations} />
      <h1 className="text-2xl font-bold mt-4">
        {t("translations.reservationDetails")}
      </h1>
      <div className="grid grid-cols-1 max-md:grid-cols-1 gap-3">
        {/* first col */}
        <div className="flex justify-between items-start flex-wrap gap-8 mt-5">
          {/* <div className=" text-xl flex items-center gap-2">
            <p>
              {t("translations.createdBy")} :{" "}
              <span className="font-bold">{cruise?.user?.name}</span>
            </p>
            <Avatar>
              <AvatarImage src={cruise?.user?.image} />
              <AvatarFallback>{cruise?.user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div> */}
          {/* <Separator className="mt-5" /> */}
          <div className="flex flex-col items-start justify-center gap-2">
            <p className="font-bold text-xl">{t("cruisesTable.name")}</p>
            <p className="font-medium text-lg">{cruise?.name}</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <p className="font-bold text-xl">{t("cruisesTable.description")}</p>
            <p className="font-semibold text-lg">{cruise?.description}</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <p className="font-bold text-xl">{t("translations.voting")}</p>
            <p className="font-bold text-lg">
              {cruise?.rating ? cruise?.rating : t("translations.noRate")}
            </p>
          </div>
          <Location cruise={cruise} />
          <DateDetails />

          <TotalAccomodation />

          {cruise?.amenities && cruise?.amenities.length > 0 && (
            <>
              {/* <Separator className="mt-5" /> */}
              <div className="flex items-start justify-center gap-2 ">
                <h1 className="text-xl font-bold">
                  {t("cruisesTable.amenities")}:
                </h1>
                <p className="mt-2 text-lg font-semibold">
                  {cruise?.amenities.map((amenity, index) => (
                    <span key={index}>
                      {amenity}
                      {index < cruise.amenities.length - 1 && ", "}
                    </span>
                  ))}{" "}
                </p>
              </div>
            </>
          )}
          <TotalPrice />
        </div>

        {/* second col */}
        {currentUser?.role !== "cruiseOwner" && (
          <div className="w-full">
            <ListingReservation
              reservations={reservations}
              currentUser={currentUser}
              cruise={cruise}
              attractions={attractions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
