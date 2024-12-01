"use client";
import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[]; // Array of images URLs
}

const ImageUploadOne: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const t = useTranslations();
  const handleUpload = useCallback(
    (result: any) => {
      const newImageUrl = result?.info?.secure_url;
      // Set the new image as the first image in the array
      onChange([newImageUrl, ...value]); // Insert new image at the start
    },
    [onChange, value]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="cruises"
      options={{ maxFiles: 1 }} // Limit to 1 image at a time
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className={cn(
              `relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20
              border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600`
            )}
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">
              {t("translations.clickToUpload")}
            </div>

            {/* Display the first image in the array or fallback to an empty string if no image is present */}
            {value.length > 0 && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  alt="Uploaded image"
                  fill
                  style={{ objectFit: "cover" }} // Replace objectFit and layout with style
                  src={value[0]} // Show the first image in the array
                  className=""
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUploadOne;
