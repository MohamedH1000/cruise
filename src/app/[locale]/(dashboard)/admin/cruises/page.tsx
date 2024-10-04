import React from "react";
import { getAllCruisesTable } from "@/lib/actions/cruise.action";
import CruisesTable, { Payment } from "./components/CruisesTable/CruisesTable";

const page = async () => {
  const cruises = await getAllCruisesTable();

  // console.log(cruises);

  return (
    <>
      <h1 className="font-bold text-3xl">الكروزات المتواجدة</h1>
      <CruisesTable data={cruises} />
    </>
  );
};

export default page;
