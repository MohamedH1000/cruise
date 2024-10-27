import Image from "next/image";
import React from "react";

interface ImageGalleryProps {
  images: string[];
}
const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full h-[400px] overflow-y-auto gap-2 mt-10 rounded-md shadow-md border-[1px]">
      {images?.map((img, i) => (
        <div key={i}>
          <Image
            src={img}
            alt="image"
            width={78}
            height={78}
            className="w-full h-full rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
