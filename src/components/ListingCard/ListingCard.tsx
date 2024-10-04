"use client";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import HeartButton from "./HeartButton";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const ListingCard = ({ data, currentUser, attraction }: any) => {
  const locale = useLocale();
  const t = useTranslations();
  return (
    <motion.div
      className="col-span-1 cursor-default group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className={
            "aspect-square relative overflow-hidden rounded-xl border-[1px] shadow-md h-full"
          }
        >
          <Suspense>
            <Carousel
              className="relative w-full h-full"
              opts={{
                loop: true,
              }}
              orientation="horizontal"
            >
              <CarouselContent
                className={`${
                  locale === "ar" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {data.imageSrc?.map((image: string, index: number) => (
                  <CarouselItem key={index} className="relative aspect-square">
                    <Image
                      src={image}
                      alt={`Listing Image ${index + 1}`}
                      className="object-cover group-hover:scale-110 transition"
                      fill
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {data?.imageSrc?.length > 1 && (
                <>
                  <CarouselPrevious className="absolute top-1/2 left-3 transform -translate-y-1/2 -z-1 bg-white p-2 rounded-full shadow-md cursor-pointer" />
                  <CarouselNext className="absolute top-1/2 right-3 transform -translate-y-1/2 -z-1 bg-white p-2 rounded-full shadow-md cursor-pointer" />
                </>
              )}
            </Carousel>
          </Suspense>

          <div className="absolute top-3 right-3">
            <HeartButton listingId={data?.id} currentUser={currentUser} />
          </div>
        </div>
        {!attraction && (
          <>
            <div className="flex justify-center items-center font-bold text-[18px]">
              {data?.title}
            </div>
            <div className="flex flex-row items-center gap-1 justify-between">
              <div className="font-semibold">{t("translations.price")}</div>
              <div className="font-light">
                <span className="font-bold">{data.price} SAR</span>{" "}
                {t("translations.pernight")}
              </div>
            </div>
            <Link
              href={`/reservation/${data?.id}`}
              className="w-full text-center bg-[#003b95] text-white hover:border-[#003b95] hover:border-[1px] hover:bg-white hover:text-[#003b95] transition duration-300 p-2 rounded-md font-bold"
            >
              {t("translations.reservenow")}
            </Link>
          </>
        )}
        {attraction && (
          <Link
            href={`/attractions/${data?.id}`}
            className="w-full text-center bg-[#003b95] text-white hover:border-[#003b95] hover:border-[1px] hover:bg-white hover:text-[#003b95] transition duration-300 p-2 rounded-md font-bold"
          >
            {t("translations.showAttraction")}
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ListingCard;
