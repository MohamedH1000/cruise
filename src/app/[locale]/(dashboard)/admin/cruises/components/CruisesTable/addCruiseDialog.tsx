"use client";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ImageUpload from "@/components/imageUpload/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import {
  createCruise,
  createCruiseByOwner,
  updateCruise,
} from "@/lib/actions/cruise.action";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("./Map"), { ssr: false });

const AddCruiseDialog = ({ cruiseOwner, admin, edit, cruiseEditData }: any) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cruiseDetails, setCruiseDetails] = useState<any>({
    name: cruiseEditData?.name || "",
    description: cruiseEditData?.description || "",
    imageSrc: cruiseEditData?.imageSrc || [],
    amenities: cruiseEditData?.amenities || [],
    price: cruiseEditData?.price || null,
    location: cruiseEditData?.location || {},
    numberOfGuests: cruiseEditData?.numberOfGuests || null,
    discount: cruiseEditData?.discount || "",
    delivery: cruiseEditData?.delivery || "",
  });
  // console.log("cruise details", cruiseEditData);
  const clear = () => {
    setCruiseDetails({
      name: "",
      description: "",
      imageSrc: [],
      amenities: [],
      location: {},
      price: null,
      numberOfGuests: null,
      discount: "",
      delivery: null,
    });
  };

  // console.log(cruiseDetails);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // Explicitly check for admin === true
    if (admin) {
      try {
        await createCruise(cruiseDetails);
        toast.success("Cruise created successfully");
      } catch (error) {
        console.error("Error occurred:", error);
        toast.error("There was an error adding the cruise.");
      } finally {
        setIsLoading(false);
        setOpen(false);
      }
    } else if (edit) {
      try {
        await updateCruise(cruiseEditData?.id, cruiseDetails);
        toast.success("Cruise updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("There was an error updating the cruise.");
      }
    } else {
      try {
        await createCruiseByOwner(cruiseDetails);
        toast.success("Cruise added successfully, pending admin approval.");
      } catch (error) {
        console.error("Error occurred:", error);
        toast.error("You are not authorized to create the cruise.");
      } finally {
        setIsLoading(false);
        setOpen(false);
        clear();
      }
    }
  };
  return (
    <>
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
            {edit ? t("cruisesTable.edit") : t("cruisesTable.addNewCruise")}
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
                    {edit ? "قم بتعديل اليخت" : "قم باضافة اليخت"}
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
                  <h1>ما هي وسائل الراحة التي تمتلكها؟</h1>
                  <div className="flex justify-between items-center">
                    <p>عدد الضيوف</p>
                    <Input
                      type="number"
                      placeholder="عدد الضيوف"
                      className="w-[100px] rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                      value={cruiseDetails?.numberOfGuests}
                      onChange={(e) =>
                        setCruiseDetails({
                          ...cruiseDetails,
                          numberOfGuests: e.target.value,
                        })
                      }
                      disabled={isLoading ? true : false}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-start gap-3">
                    <p>الاسم</p>
                    <Input
                      type="string"
                      placeholder="الاسم"
                      className="w-full rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                      value={cruiseDetails?.name}
                      onChange={(e) =>
                        setCruiseDetails({
                          ...cruiseDetails,
                          name: e.target.value,
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
                      value={cruiseDetails?.description}
                      onChange={(e) =>
                        setCruiseDetails({
                          ...cruiseDetails,
                          description: e.target.value,
                        })
                      }
                      disabled={isLoading ? true : false}
                    />
                  </div>
                  <h1 className="mt-5 text-[#1e4164] font-bold">
                    {t("translations.locationTarget")}
                  </h1>
                  <Map
                    setCruiseDetails={setCruiseDetails}
                    cruiseDetails={cruiseDetails}
                  />
                  <h1 className="mt-10">قم باضافة صورة:</h1>
                  <p className="opacity-60">أظهر لعملائك كيف يبدو المكان</p>
                  <ImageUpload
                    value={cruiseDetails?.imageSrc || []}
                    onChange={(value) =>
                      setCruiseDetails({
                        ...cruiseDetails,
                        imageSrc: value,
                      })
                    }
                  />
                  <p className="opacity-85">
                    كم سعر خدمة التوصيل لليخت ان وجدت ؟
                  </p>
                  <Input
                    type="number"
                    placeholder="سعر التوصيل"
                    className="w-full rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                    value={cruiseDetails?.delivery}
                    onChange={(e) =>
                      setCruiseDetails({
                        ...cruiseDetails,
                        delivery: e.target.value,
                      })
                    }
                    required
                    disabled={isLoading ? true : false}
                  />
                  <h1 className="font-bold mt-5">الان, قم بتسعير اليخت</h1>
                  <p className="opacity-85">كم سعر اليخت بالليلة؟</p>
                  <Input
                    type="number"
                    placeholder="السعر بالليلة الواحدة"
                    className="w-full rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                    value={cruiseDetails?.price}
                    onChange={(e) =>
                      setCruiseDetails({
                        ...cruiseDetails,
                        price: e.target.value,
                      })
                    }
                    required
                    disabled={isLoading ? true : false}
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
                      ? "تعديل اليخت"
                      : "قم باضافة اليخت"}
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
    </>
  );
};

export default AddCruiseDialog;
