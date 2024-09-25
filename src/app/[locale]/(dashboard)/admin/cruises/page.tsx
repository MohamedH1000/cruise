import React from "react";
import CruisesTable, { Payment } from "../components/CruisesTable/CruisesTable";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    // ...
  ];
}
const page = async () => {
  const data = await getData();

  return (
    <>
      <h1 className="font-bold text-3xl">الكروزات المتواجدة</h1>
      <CruisesTable data={data} />
    </>
  );
};

export default page;
