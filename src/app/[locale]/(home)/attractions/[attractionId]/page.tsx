import { getAttractionById } from "@/lib/actions/attraction.action";
import Image from "next/image";
import React from "react";
import ImageGallery from "./components/imageGallery";

const page = async ({ params }: { params: string }) => {
  const { attractionId }: any = params;
  const attraction = await getAttractionById(attractionId);
  return (
    <div
      className="mt-[100px] lg:px-[180px]
  md:px-[50px] max-sm:px-[10px] max-md:px-[50px]  max-md:mt-[100px] mb-10"
    >
      <h1 className="font-bold text-4xl">{attraction?.name}</h1>
      <ImageGallery attraction={attraction} />
      <p className="mt-10 font-semibold text-xl">{attraction?.description}</p>
    </div>
  );
};

export default page;
