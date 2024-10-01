import { getCruiseById } from "@/lib/actions/cruise.action";
import React from "react";
import ImageGallery from "./components/ImageGallery";

const page = async ({ params }: any) => {
  const cruise = await getCruiseById(params.cruiseId);
  //   console.log(cruise);
  return (
    <div
      className="mt-[130px] lg:px-[180px]
  md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <h1 className="font-bold text-4xl">{cruise?.name}</h1>
      <ImageGallery images={cruise?.imageSrc} />
      <p className="font-semibold text-2xl opacity-85 my-10">
        {cruise?.description}
      </p>
    </div>
  );
};

export default page;
