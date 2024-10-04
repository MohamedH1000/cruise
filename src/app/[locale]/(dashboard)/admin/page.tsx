import React from "react";
import AttractionsTable from "./attractionsTable";
import { getAllAttractionsTable } from "@/lib/actions/attraction.action";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const attractions = await getAllAttractionsTable();
  const t = await getTranslations();
  // console.log(attractions);
  return (
    <div className="mt-[100px]">
      <h1 className="font-bold text-3xl">{t("Accessibility.attractions")}</h1>
      <AttractionsTable data={attractions || []} />
    </div>
  );
};

export default page;
