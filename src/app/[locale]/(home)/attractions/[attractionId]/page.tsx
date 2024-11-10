import { getAttractionById } from "@/lib/actions/attraction.action";
import Image from "next/image";
import React from "react";
import ImageGallery from "./components/imageGallery";
import { staticContentMap } from "@/lib/utils/attractionDetails";

const page = async ({ params }: { params: string }) => {
  const { attractionId }: any = params;
  const attraction = await getAttractionById(attractionId);
  const staticContent = staticContentMap[attractionId]?.content || [];

  return (
    <div
      className="mt-[100px] lg:px-[180px]
  md:px-[50px] max-sm:px-[10px] max-md:px-[50px]  max-md:mt-[100px] mb-10"
    >
      <h1 className="font-bold text-4xl">{attraction?.name}</h1>
      <h1 className="mt-10 font-semibold text-xl">{attraction?.subtitle}</h1>
      <p className="mt-10 font-semibold text-xl">{attraction?.description}</p>
      <ImageGallery attraction={attraction} />
      {staticContent.map((contentItem, index) => (
        <div key={index} className="mt-10">
          <p className="font-semibold text-lg mb-4">{contentItem.name}</p>
          <p className="font-semibold text-lg mb-4">
            {contentItem.description && contentItem.description}
          </p>
          <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full h-[400px] overflow-y-auto gap-2 mt-10 rounded-md shadow-md border-[1px]">
            {contentItem.imageUrl &&
              contentItem.imageUrl.length > 0 &&
              contentItem.imageUrl.map((imageUrl, imgIndex) => (
                <Image
                  key={imgIndex}
                  src={imageUrl}
                  alt={`Image ${imgIndex + 1} for attraction ${attractionId}`}
                  width={80}
                  height={80}
                  className="w-full h-full rounded-md"
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
