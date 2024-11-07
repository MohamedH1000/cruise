"use client";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ImageUpload from "@/components/imageUpload/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createAttraction,
  updateAttraction,
} from "@/lib/actions/attraction.action";
import { fetchRestaurants } from "@/lib/actions/restaurant.action";
import Select from "react-select";

const AddAttractionDialog = ({
  cruiseOwner,
  admin,
  edit,
  attractionEditData,
}: any) => {
  const t = useTranslations();
  // console.log(attractionEditData);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [attractionData, setAttractionData] = useState<any>({
    name: attractionEditData?.name || "",
    description: attractionEditData?.description || "",
    subtitle: attractionEditData?.subtitle || "",
    imageSrc: attractionEditData?.imageSrc || [],
    restaurantIds:
      attractionEditData?.restaurants?.map((r: any) => ({
        value: r.restaurant.id,
        label: r.restaurant.name,
      })) || [],
  });
  // console.log("cruise details", cruiseDetails);
  const clear = () => {
    setAttractionData({
      name: "",
      description: "",
      subtitle: "",
      imageSrc: [],
      restaurantIds: [],
    });
  };

  // console.log(cruiseDetails);
  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const fetchedRestaurants: any = await fetchRestaurants(); // Fetch restaurants
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    if (open) {
      getRestaurants();
    }
  }, [open]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (edit) {
        // Update existing attraction
        await updateAttraction(attractionEditData.id, attractionData); // Use update function with attraction ID
        toast.success("تم تعديل المعلم السياحي بنجاح");
      } else {
        // Create new attraction
        await createAttraction(attractionData);
        toast.success("تم اضافه المعلم السياحي للنظام بنجاح");
      }
      clear();
    } catch (error) {
      console.log(error);
      if (edit) {
        toast.error("حدثت مشكله اثناء تعديل المعلم السياحي");
      } else {
        toast.error("حدثت مشكله اثناء اضافة المعلم السياحي");
      }
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 100, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2 }}
      >
        <Button
          className={cn(
            `  text-white rounded-[12px]
            transition duration-300 p-4 text-[14px] font-medium`,
            {
              "bg-[#003b95] mt-10": cruiseOwner,
              "bg-black mt-10": admin,
              "bg-yellow-500": edit,
            }
          )}
          onClick={() => setOpen((prev: any) => !prev)}
        >
          {edit
            ? t("AttractionTable.edit")
            : t("AttractionTable.addNewAttraction")}
        </Button>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 100, scale: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ opacity: 0, scale: 0.9 }}
            dir="ltr"
            className={` ${
              open
                ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                : "hidden"
            }`}
          >
            <div
              className="relative bg-white rounded-[12px] py-5 border-[1px]
              border-[#003b95] shadow-lg w-[500px] max-w-[90%]
              mx-auto overflow-y-auto h-[500px] px-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h1 className="text-center font-bold text-[18px]">
                  {edit
                    ? "قم بتعديل المعلم السياحي الجديد"
                    : "قم باضافة المعلم السياحي الجديد"}
                </h1>
                <Image
                  src={"/assets/close.png"}
                  alt="close"
                  width={10}
                  height={10}
                  className="cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <Separator />
              <div className="flex flex-col gap-5" dir="rtl">
                <div className="flex flex-col justify-center items-start gap-3">
                  <p>الاسم</p>
                  <Input
                    type="string"
                    placeholder="الاسم"
                    className="w-full rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                    value={attractionData?.name}
                    onChange={(e) =>
                      setAttractionData({
                        ...attractionData,
                        name: e.target.value,
                      })
                    }
                    disabled={isLoading ? true : false}
                  />
                </div>
                <div className="flex flex-col justify-center items-start gap-3">
                  <p>الاسم الفرعي</p>
                  <Input
                    type="string"
                    placeholder="الاسم الفرعي"
                    className="w-full rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                    value={attractionData?.subtitle}
                    onChange={(e) =>
                      setAttractionData({
                        ...attractionData,
                        subtitle: e.target.value,
                      })
                    }
                    disabled={isLoading ? true : false}
                  />
                </div>
                <div className="flex flex-col items-start justify-center gap-3">
                  <p>الوصف</p>
                  <Textarea
                    placeholder="الوصف"
                    className="w-full rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                    value={attractionData?.description}
                    onChange={(e) =>
                      setAttractionData({
                        ...attractionData,
                        description: e.target.value,
                      })
                    }
                    disabled={isLoading ? true : false}
                  />
                </div>
                <div className="mt-5">
                  <p>اختر المطاعم</p>
                  <Select
                    isMulti
                    options={restaurants.map((restaurant) => ({
                      value: restaurant.id,
                      label: restaurant.name,
                    }))}
                    value={attractionData.restaurantIds}
                    className="rounded-md mt-3"
                    onChange={(selected) =>
                      setAttractionData({
                        ...attractionData,
                        restaurantIds: selected,
                      })
                    }
                  />
                </div>
                <h1 className="mt-10">قم باضافة صورة:</h1>
                <p className="opacity-60">أظهر لعملائك كيف يبدو المكان</p>
                <ImageUpload
                  value={attractionData?.imageSrc || []}
                  onChange={(value) =>
                    setAttractionData({
                      ...attractionData,
                      imageSrc: value,
                    })
                  }
                />
                <Button
                  className="w-full bg-[#003b95] text-white rounded-[12px]
                  border-[#003b95] hover:border-[1px] hover:bg-white hover:text-[#003b95]
                  transition duration-300 font-bold"
                  onClick={handleSubmit}
                  disabled={isLoading ? true : false}
                >
                  {isLoading
                    ? "برجاء الانتظار"
                    : edit
                    ? "قم بتعديل المعلم السياحي"
                    : "قم باضافة المعلم السياحي"}
                </Button>
                <Button
                  onClick={clear}
                  disabled={isLoading ? true : false}
                  className="rounded-[12px]"
                >
                  اعد تعبئة الحقول
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddAttractionDialog;
