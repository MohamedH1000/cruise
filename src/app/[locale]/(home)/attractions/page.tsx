import ListingCard from "@/components/ListingCard/ListingCard";
import { getAllAttractions } from "@/lib/actions/attraction.action";
import { getTranslations } from "next-intl/server";
import React from "react";

const page = async () => {
  const t = await getTranslations();
  const allAttractions = await getAllAttractions();
  return (
    <div
      className="lg:px-[180px] mt-[70px]
  md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <h1 className="mt-[100px] text-4xl font-bold">
        {t("NavItems.attractions")}
      </h1>
      <div
        className="mt-10 grid gap-8 w-full lg:grid-cols-3 
max-md:grid-cols-2 max-sm:grid-cols-1 md:grid-cols-2 mb-10"
      >
        {allAttractions?.map((attract) => (
          <ListingCard attraction key={attract.id} data={attract} />
        ))}
      </div>
    </div>
  );
};

export default page;
