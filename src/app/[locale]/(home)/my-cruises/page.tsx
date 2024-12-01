import React from "react";
import {
  getAllCruisesTable,
  getMyCruisesTable,
} from "@/lib/actions/cruise.action";
import MyCruisesTable from "./components/MyCruisesTable";
import { getCurrentUser } from "@/lib/actions/user.action";

const page = async () => {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.id;
  const cruises = await getMyCruisesTable(userId);
  // console.log(cruises);
  return (
    <div
      className="mt-[120px] lg:px-[180px]
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <h1 className="font-bold text-3xl">الكروزات المتواجدة</h1>
      <MyCruisesTable data={cruises} />
    </div>
  );
};

export default page;
