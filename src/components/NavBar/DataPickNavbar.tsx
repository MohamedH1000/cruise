"use client";
import { useTranslations } from "next-intl";
import React from "react";
import DataPicker from "./DataPicker";
import { motion } from "framer-motion";

const DataPickNavbar = () => {
  const t = useTranslations();
  return (
    <div
      className="mt-[64px] bg-[#003b95] text-white h-auto lg:px-[180px]
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px] py-5"
    >
      <div className="h-full flex flex-col items-center justify-center">
        <motion.h1
          className="font-bold text-5xl text-center hover:animate-pulse"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t("NavItems.CruiseSearch")}
        </motion.h1>
        <motion.p
          className="mt-5 text-2xl text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {t("NavItems.cruiseDescription")}
        </motion.p>
      </div>
      <iframe
        width="600"
        height="400"
        className="w-full rounded-lg mt-10"
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="flex max-sm:flex-col mt-5 justify-between w-full max-sm:gap-3">
        <p className="font-bold text-lg ">{t("translations.discover")}</p>
        <p className="font-bold text-lg ">{t("translations.cruiseDesign")}</p>
        <p className="font-bold text-lg ">{t("translations.enjoySea")}</p>
      </div>
      <p className="mt-5 w-full text-lg font-bold">
        {t("translations.bookCruise")}
      </p>
      <div className="mt-5">
        <DataPicker />
      </div>
    </div>
  );
};

export default DataPickNavbar;
