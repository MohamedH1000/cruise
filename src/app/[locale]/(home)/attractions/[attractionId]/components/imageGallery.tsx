"use client";
import Image from "next/image";
import React from "react";

const ImageGallery = ({ attraction }: any) => {
  return (
    <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full h-[400px] overflow-y-auto gap-2 mt-10 rounded-md shadow-md border-[1px]">
      {attraction?.imageSrc.map((img: any) => (
        <Image
          src={img}
          alt="image"
          width={80}
          height={80}
          className="w-full h-full rounded-md"
        />
      ))}
    </div>
  );
};

export default ImageGallery;
