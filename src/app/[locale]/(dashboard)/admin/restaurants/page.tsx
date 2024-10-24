import { getTranslations } from "next-intl/server";
import React from "react";
import RestaurantTable from "./components/RestaurantTable/RestaurantTable";
import { getAllRestaurantsTable } from "@/lib/actions/restaurant.action";

const page = async () => {
  const t = await getTranslations();
  const restaurants = await getAllRestaurantsTable();
  return (
    <>
      <h1 className="font-bold text-3xl">{t("cruisesTable.restaurants")}</h1>
      <RestaurantTable data={restaurants || []} />
    </>
  );
};

export default page;
