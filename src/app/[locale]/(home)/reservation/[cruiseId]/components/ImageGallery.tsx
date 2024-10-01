import Image from "next/image";
import React from "react";

interface ImageGalleryProps {
  images: string[];
}
const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-[50px]">
      {images?.map((img, i) => (
        <div key={i}>
          <Image
            src={img}
            alt="image"
            width={78}
            height={78}
            className="w-full h-auto rounded-md"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
