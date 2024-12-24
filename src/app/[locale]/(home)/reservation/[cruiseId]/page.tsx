import { getCruiseById } from "@/lib/actions/cruise.action";
import React from "react";
import ImageGallery from "./components/ImageGallery";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ListingReservation from "./components/ListingReservation";
import { getAllReservations } from "@/lib/actions/reservation.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import {
  getAllAttractionsTable,
  getCombinedAttractionsByRestaurantArray,
} from "@/lib/actions/attraction.action";
import DataPicker from "./components/DataPicker";

const page = async ({ params }: any) => {
  const cruise = await getCruiseById(params.cruiseId);
  const reservations = await getAllReservations();
  const attractions = await getAllAttractionsTable();
  const combinedAttractions = await getCombinedAttractionsByRestaurantArray();
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
      <div className="grid grid-cols-1 max-md:grid-cols-1 gap-3">
        {/* first col */}
        <div className="flex justify-between items-start flex-wrap gap-3 mt-5">
          <div className=" text-xl flex items-center gap-2">
            <p>
              {t("translations.createdBy")} :{" "}
              <span className="font-bold">{cruise?.user?.name}</span>
            </p>
            <Avatar>
              <AvatarImage src={cruise?.user?.image} />
              <AvatarFallback>{cruise?.user?.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          {/* <Separator className="mt-5" /> */}
          <div className="flex flex-col items-start justify-center gap-2">
            <p className="font-bold text-2xl">{t("cruisesTable.name")}</p>
            <p className="font-semibold text-xl">{cruise?.name}</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <p className="font-bold text-2xl">
              {t("cruisesTable.description")}
            </p>
            <p className="font-semibold text-xl">{cruise?.description}</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-2">
            <p className="font-bold text-xl">{t("translations.voting")}</p>
            <p>{cruise?.rating}</p>
          </div>
          {cruise?.amenities && cruise?.amenities.length > 0 && (
            <>
              {/* <Separator className="mt-5" /> */}
              <div className="flex flex-col items-start justify-center gap-2 ">
                <h1 className="text-2xl font-bold">
                  {t("cruisesTable.amenities")}
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
        </div>
        <Separator className="mt-5" />
        <h1 className="font-bold text-2xl mt-5">
          {t("translations.location")}
        </h1>
        {cruise?.location?.lat ? (
          <iframe
            width="550"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            className="rounded-md mt-5 w-full"
            src={`https://www.google.com/maps?q=${cruise?.location?.lat},${cruise?.location?.lng}&hl=es;z=14&output=embed`}
          ></iframe>
        ) : (
          <div className="mt-20">
            <h1 className="font-bold text-xl">
              {t("translations.noLocation")}
            </h1>
          </div>
        )}
        {/* second col */}
        {currentUser?.role !== "cruiseOwner" && (
          <div className="w-full">
            <ListingReservation
              reservations={reservations}
              currentUser={currentUser}
              cruise={cruise}
              attractions={attractions}
              combAttractions={combinedAttractions}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
