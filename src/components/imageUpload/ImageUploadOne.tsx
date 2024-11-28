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
  value: string[];
  profile?: any;
  currentUser?: any;
}
const ImageUploadOne: React.FC<ImageUploadProps> = ({
  onChange,
  value,
  profile,
  currentUser,
}) => {
  const t = useTranslations();
  const handleUpload = useCallback(
    (result: any) => {
      // console.log(result);
      profile
        ? onChange(result?.info?.secure_url)
        : onChange([...value, result?.info?.secure_url]);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="cruises"
      options={{ maxFiles: 1 }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className={cn(
              `relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20
            border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600`,
              {
                "rounded-md": profile,
              }
            )}
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">
              {t("translations.clickToUpload")}
            </div>
            {(profile ? value || currentUser?.image || "" : value[0]) && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  alt="Upload"
                  fill
                  style={{ objectFit: "cover" }} // Replace objectFit and layout with style
                  src={profile ? value || currentUser?.image || "" : value[0]}
                  className={`${profile ? "rounded-md" : ""}`}
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
