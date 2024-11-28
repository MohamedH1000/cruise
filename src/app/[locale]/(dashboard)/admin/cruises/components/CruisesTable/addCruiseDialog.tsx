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
import "./cruise.css";
import {
  createCruise,
  createCruiseByOwner,
  updateCruise,
} from "@/lib/actions/cruise.action";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import ImageUploadOne from "@/components/imageUpload/ImageUploadOne";
import Select from "react-select";

const Map = dynamic(() => import("./Map"), { ssr: false });

const AddCruiseDialog = ({ cruiseOwner, admin, edit, cruiseEditData }: any) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);
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
  const amenities = [
    { value: "العروض", label: `${t("translations.offers")}` },
    { value: "مواقف سيارة مجاني", label: `${t("translations.freeParking")}` },
    { value: "انترنت مجاني", label: `${t("translations.freeInternet")}` },
    {
      value: "منطقة جلوس خارجية",
      label: `${t("translations.outdoorSeating")}`,
    },
    { value: "منطقة جلوس داخلية", label: `${t("translations.indoorSeating")}` },
    { value: "منطقة تناول الطعام", label: `${t("translations.dining")}` },
    { value: "شامل الإفطار", label: `${t("translations.includeBreak")}` },
    { value: "مطبخ", label: `${t("translations.kitchen")}` },
    { value: "غسالة ملابس", label: `${t("translations.waching")}` },
    { value: "تلفزيون", label: `${t("translations.tv")}` },
    {
      value: "ماكينة تحضير الشاي/القهوة",
      label: `${t("translations.teaMaker")}`,
    },
    { value: "خدمة تنظيف الغرف", label: `${t("translations.roomService")}` },
    { value: "جاكوزي", label: `${t("translations.Jacuzzi")}` },
    { value: "كرسي مساج", label: `${t("translations.messageChair")}` },
    {
      value: "ملائم لذوي الاحتياجات الخاصة",
      label: `${t("translations.accessible")}`,
    },
  ];
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

    const updatedCruiseDetails = {
      ...cruiseDetails,
      imageSrc: [cruiseDetails.primaryImage, ...cruiseDetails.imageSrc].filter(
        Boolean
      ), // Ensure the primary image is first
    };

    // Explicitly check for admin === true
    if (admin) {
      try {
        await createCruise(updatedCruiseDetails);
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
        await updateCruise(cruiseEditData?.id, updatedCruiseDetails);
        toast.success("Cruise updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("There was an error updating the cruise.");
      }
    } else {
      try {
        await createCruiseByOwner(updatedCruiseDetails);
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
                  <div>
                    <p>اختر المميزات</p>
                    <Select
                      options={amenities}
                      value={cruiseDetails?.amenities.map((amenity: string) =>
                        amenities.find((option) => option.value === amenity)
                      )} // Map the stored values to objects
                      isMulti
                      className="rounded-md mt-3 z-[100]"
                      onChange={(selected: any) =>
                        setCruiseDetails({
                          ...cruiseDetails,
                          amenities: selected.map(
                            (option: any) => option.value
                          ), // Store only values
                        })
                      }
                    />
                  </div>
                  <h1 className="mt-5 text-[#1e4164] font-bold">
                    {t("translations.locationTarget")}
                  </h1>

                  <div className="z-10">
                    {/* Map Component */}
                    <div onClick={() => setShowFullscreenMap(true)}>
                      {" "}
                      {/* Trigger fullscreen map */}
                      <Map
                        setCruiseDetails={setCruiseDetails}
                        cruiseDetails={cruiseDetails}
                      />
                    </div>
                  </div>

                  {showFullscreenMap && (
                    <div
                      className="fixed inset-0 z-[1000] bg-black bg-opacity-75 flex items-center justify-center flex-col"
                      // Close fullscreen on click
                    >
                      <div
                        className="w-full bg-[black] flex justify-between items-center 
                      text-[white] h-[64px] p-4"
                      >
                        <h1 className="font-bold text-xl">
                          قم بتحديد المكان على الخريطه
                        </h1>
                        <Image
                          src={"/assets/icons/close.png"}
                          alt="close icon"
                          height={20}
                          width={20}
                          className="invert cursor-pointer"
                          onClick={() => setShowFullscreenMap(false)}
                        />
                      </div>
                      <div className="w-full h-full">
                        <Map
                          setCruiseDetails={setCruiseDetails}
                          cruiseDetails={cruiseDetails}
                          fullHeight
                        />
                      </div>
                    </div>
                  )}
                  <h1 className="mt-10">
                    قم باضافة الصورة التي ستظهر في البحث:
                  </h1>
                  <ImageUploadOne
                    value={
                      cruiseDetails?.primaryImage
                        ? [cruiseDetails?.primaryImage]
                        : []
                    }
                    onChange={(value) =>
                      setCruiseDetails({
                        ...cruiseDetails,
                        primaryImage: value[0], // Ensure only one image is selected
                      })
                    }
                    // Limit to one file for primary image
                  />
                  <h1 className="mt-10">قم باضافة الصور الخاصة باليخت:</h1>
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
