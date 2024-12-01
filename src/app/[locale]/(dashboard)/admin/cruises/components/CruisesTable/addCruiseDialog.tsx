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
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { getAmenities } from "@/lib/constants/amenties";

const Map = dynamic(() => import("./Map"), { ssr: false });

const AddCruiseDialog = ({ cruiseOwner, admin, edit, cruiseEditData }: any) => {
  const t = useTranslations();
  const amenities = getAmenities(t);

  const [open, setOpen] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showFullscreenMap, setShowFullscreenMap] = useState(false);
  const [cruiseDetails, setCruiseDetails] = useState<any>({
    name: cruiseEditData?.name || "",
    description: cruiseEditData?.description || "",
    imageSrc: cruiseEditData?.imageSrc || [],
    amenities: cruiseEditData?.amenities || [],
    price: cruiseEditData?.price || null,
    location: cruiseEditData?.location || {},
    numberOfGuests: {
      adults: cruiseEditData?.numberOfGuests.adults || null,
      kids: cruiseEditData?.numberOfGuests.kids || null,
    },
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
      numberOfGuests: { adults: null, kids: null },
      discount: "",
      delivery: null,
    });
  };
  const openGalleryDialog = () => setOpenDialog(true);
  const closeGalleryDialog = () => setOpenDialog(false);
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
  const handleImageDelete = (index) => {
    // Remove the image at the specified index
    const updatedImageSrc = [...cruiseDetails.imageSrc];
    updatedImageSrc.splice(index + 1, 1); // Remove from the imageSrc array, excluding the primary image

    setCruiseDetails({
      ...cruiseDetails,
      imageSrc: updatedImageSrc,
    });
  };
  const handleDeletePrimaryImage = () => {
    // Remove the primary image and reset the imageSrc
    setCruiseDetails({
      ...cruiseDetails,
      primaryImage: null, // Clear the primary image
      imageSrc: cruiseDetails.imageSrc.slice(1), // Remove the first image (primary image)
    });
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
                  <h1 className="text-center font-bold text-[18px] my-3">
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
                  <div className="flex justify-between items-start mt-5">
                    <p>عدد الضيوف</p>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="number"
                        placeholder="عدد الكبار"
                        className="w-[100px] rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                        value={cruiseDetails?.numberOfGuests?.adults}
                        onChange={(e) =>
                          setCruiseDetails({
                            ...cruiseDetails,
                            numberOfGuests: {
                              ...cruiseDetails.numberOfGuests, // Preserve existing properties
                              adults: e.target.value,
                            },
                          })
                        }
                        disabled={isLoading ? true : false}
                      />
                      <Input
                        type="number"
                        placeholder="عدد الصغار"
                        className="w-[100px] rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                        value={cruiseDetails?.numberOfGuests?.kids}
                        onChange={(e) =>
                          setCruiseDetails({
                            ...cruiseDetails,
                            numberOfGuests: {
                              ...cruiseDetails.numberOfGuests,
                              kids: e.target.value,
                            },
                          })
                        }
                        disabled={isLoading ? true : false}
                      />
                    </div>
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
                    <h1 className="font-bold">
                      ما هي وسائل الراحة التي تمتلكها؟
                    </h1>
                    <p className="mt-2">اختر المميزات</p>
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
                      edit && cruiseEditData?.primaryImage
                        ? [cruiseEditData.primaryImage] // Use the primary image from the edit data if available
                        : cruiseDetails?.primaryImage
                        ? [cruiseDetails.primaryImage] // If primaryImage exists, use it
                        : cruiseDetails.imageSrc.length > 0
                        ? [cruiseDetails.imageSrc[0]] // If no primaryImage, use the first image in imageSrc
                        : [] // Default to an empty array if there are no images
                    }
                    onChange={(value) => {
                      const updatedPrimaryImage = value[0]; // Get the new primary image

                      // Create a copy of the imageSrc array and set it to updatedImageSrc
                      let updatedImageSrc = [...cruiseDetails.imageSrc];

                      // Update imageSrc to include the new primary image at the start, avoiding duplication
                      if (!updatedImageSrc.includes(updatedPrimaryImage)) {
                        // If the primary image is not already in the array, add it to the front
                        updatedImageSrc = [
                          updatedPrimaryImage,
                          ...updatedImageSrc,
                        ];
                      } else {
                        // If it already exists, ensure it's at the front
                        updatedImageSrc = [
                          updatedPrimaryImage,
                          ...updatedImageSrc.filter(
                            (img) => img !== updatedPrimaryImage
                          ),
                        ];
                      }

                      // Log for debugging purposes
                      console.log(
                        "Updated primary image:",
                        updatedPrimaryImage
                      );
                      console.log("Updated imageSrc:", updatedImageSrc);

                      // Ensure that the primary image is updated and imageSrc is updated correctly
                      setCruiseDetails((prevState) => {
                        return {
                          ...prevState,
                          primaryImage: updatedPrimaryImage, // Update the primary image
                          imageSrc: updatedImageSrc, // Update imageSrc with the correct order
                        };
                      });
                    }}
                    disabled={isLoading}
                  />
                  {cruiseDetails?.imageSrc[0] && (
                    <Button
                      onClick={() => handleDeletePrimaryImage()}
                      className="delete-button"
                    >
                      حذف الصورة الرئيسية
                    </Button>
                  )}
                  <h1 className="mt-10">قم باضافة الصور الخاصة باليخت:</h1>
                  <p className="opacity-60">أظهر لعملائك كيف يبدو المكان</p>
                  <ImageUpload
                    value={
                      cruiseDetails?.imageSrc?.length > 1
                        ? cruiseDetails.imageSrc.slice(1) // Exclude the first image
                        : [] // Default to an empty array if no images or only one image exists
                    }
                    onChange={(value) => {
                      const updatedImageSrc = [
                        cruiseDetails.imageSrc[0],
                        ...value,
                      ]; // Ensure the first image remains as the primary, and append the new secondary images
                      setCruiseDetails({
                        ...cruiseDetails,
                        imageSrc: updatedImageSrc,
                      });
                    }}
                  />
                  <Button onClick={openGalleryDialog}>عرض الصور</Button>
                  <Dialog open={openDialog} onClose={closeGalleryDialog}>
                    <DialogContent>
                      <div>
                        {cruiseDetails.imageSrc.slice(1).map((image, index) => (
                          <div
                            key={index}
                            className="image-item flex items-center justify-between mb-2 relative"
                          >
                            <Image
                              src={image}
                              alt={`image-${index}`}
                              width={300}
                              height={300}
                              className="rounded-md"
                            />

                            {/* "X" button to delete the image */}
                            <button
                              onClick={() => handleImageDelete(index)}
                              className="absolute top-2 right-2"
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "red",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                            >
                              <AiOutlineClose />
                            </button>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={closeGalleryDialog} color="primary">
                        اغلاق
                      </Button>
                    </DialogActions>
                  </Dialog>
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
