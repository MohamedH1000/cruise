import { useTranslations } from "next-intl";
import React from "react";
import DataPicker from "./DataPicker";

const DataPickNavbar = () => {
  const t = useTranslations();
  return (
    <div
      className="mt-[64px] bg-[#003b95] text-white h-[260px] lg:px-[180px]
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <div className="h-full flex flex-col items-start justify-center">
        <h1 className="font-bold text-5xl">{t("NavItems.CruiseSearch")}</h1>
      </div>
      <div className="relative top-[-30px] ">
        <DataPicker />
      </div>
    </div>
  );
};

export default DataPickNavbar;
