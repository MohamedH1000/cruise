"use client";
import React, { Suspense } from "react";
import { motion } from "framer-motion";

import Image from "next/image";
import HeartButton from "./HeartButton";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSearchParams } from "next/navigation";

const ListingCardSearch = ({ data, currentUser, attraction }: any) => {
  const locale = useLocale();
  const t = useTranslations();
  const searchParams = useSearchParams(); // Get the search params
  const paramsString = searchParams?.toString(); // Convert to a query string

  return (
    <motion.div
      className="col-span-1 cursor-default group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <div
        className="flex justify-center items-start gap-3 border-[0.5px] 
      border-[gray] rounded-lg shadow-md p-5 max-sm:flex-col-reverse max-sm:p-2"
      >
        <div className="flex gap-2 flex-col w-[49%] max-sm:w-full">
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
                <Link href={`/attractions/${data?.id}`}>
                  <CarouselContent
                    className={`${
                      locale === "ar" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {data.imageSrc?.map((image: string, index: number) => (
                      <CarouselItem
                        key={index}
                        className="relative aspect-square"
                      >
                        <Image
                          src={image}
                          alt={`Listing Image ${index + 1}`}
                          className="object-cover group-hover:scale-110 transition"
                          fill
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Link>

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

              <Link
                href={`/reservation/${data?.id}${
                  paramsString ? `?${paramsString}` : ""
                }`}
                className="w-full text-center bg-[#003b95] text-white hover:border-[#003b95] hover:border-[1px] hover:bg-white hover:text-[#003b95] transition duration-300 p-2 rounded-md font-bold"
              >
                {t("translations.reservenow")}
              </Link>
            </>
          )}
          {attraction && (
            <>
              <Link
                href={`/attractions/${data?.id}`}
                className="w-full text-center bg-[#003b95] text-white hover:border-[#003b95] hover:border-[1px] hover:bg-white hover:text-[#003b95] transition duration-300 p-2 rounded-md font-bold"
              >
                {data.name}
              </Link>
            </>
          )}
        </div>
        <div className="h-full w-[49%] max-sm:w-full">
          <div className="flex justify-between items-center">
            <p className="font-bold">
              {t("translations.cruisename")} : {data.name}
            </p>
            <p className="font-bold">{t("translations.voting")}:</p>
          </div>
          <div className="mt-5">
            <p>{t("translations.cruiseLocation")}: مرسى المارينا</p>
          </div>
          <div className="flex flex-row items-center gap-1 justify-between mt-10">
            <div className="font-semibold">{t("translations.price")}</div>
            <div className="font-light">
              <span className="font-bold">{data.price} SAR</span>{" "}
              {t("translations.pernight")}
            </div>
          </div>
          <div className="mt-10 font-bold">
            <p>
              {t("translations.cruiseDesc")}: {data?.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCardSearch;
