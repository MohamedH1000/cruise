"use client";
import React, { useMemo } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
// import { useToast } from "../ui/use-toast";
// import {
//   addToFavourite,
//   deleteFromFavourite,
// } from "@/lib/action/chalet.action";
import { useRouter } from "next/navigation";
interface HeartButtonProps {
  listingId: string;
  currentUser: any;
}
const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
}) => {
  //   const { toast } = useToast();
  const router = useRouter();
  const hasFavourited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);
  //   const toggleFavourite = async (e: React.MouseEvent<HTMLDivElement>) => {
  //     e.stopPropagation();
  //     e.preventDefault();

  //     if (!currentUser) {
  //       toast({
  //         title: "قم بتسجيل الدخول",
  //       });
  //     }
  //     try {
  //       if (hasFavourited) {
  //         await deleteFromFavourite({ listingId });
  //         toast({
  //           title: "تم المسح من المفضلة",
  //         });
  //       } else {
  //         await addToFavourite({ listingId });
  //         toast({
  //           title: "تم الاضافة للمفضلة",
  //         });
  //       }
  //       router.refresh();
  //     } catch (error) {
  //       toast({
  //         title: "حدث خطا اثناء العملية",
  //       });
  //     }
  //   };
  return (
    <div
      //   onClick={toggleFavourite}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineHeart
        size={28}
        className="fill-[white] absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={hasFavourited ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default HeartButton;
