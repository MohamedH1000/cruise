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
import { cn } from "@/lib/utils";
import { createRestaurant } from "@/lib/actions/restaurant.action";

const AddRestaurantDialog = ({ cruiseOwner, admin }: any) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantDetails, setRestaurantDetails] = useState<any>({
    name: "",
    description: "",
    imageSrc: [],
  });
  // console.log("cruise details", cruiseDetails);
  const clear = () => {
    setRestaurantDetails({
      name: "",
      description: "",
      imageSrc: [],
    });
  };

  // console.log(cruiseDetails);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (admin) {
      try {
        await createRestaurant(restaurantDetails);
        toast.success("تم اضافه المطعم للنظام بنجاح");
        clear();
      } catch (error) {
        console.log(error);
        toast.error("حدثت مشكله اثناء اضافة المطعم");
      } finally {
        setIsLoading(false);
        setOpen(false);
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
              `mt-10  text-white rounded-[12px]
            transition duration-300 p-4 text-[14px] font-medium`,
              {
                "bg-[#003b95]": cruiseOwner,
                "bg-black": admin,
              }
            )}
            onClick={() => setOpen((prev: any) => !prev)}
          >
            {t("cruisesTable.addNewRestaurant")}
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
                    قم باضافة المطعم
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
                    <p>اسم المطعم</p>
                    <Input
                      type="string"
                      placeholder="الاسم"
                      className="w-full rounded-[12px] placeholder:opacity-75 focus:placeholder:opacity-50"
                      value={restaurantDetails?.name}
                      onChange={(e) =>
                        setRestaurantDetails({
                          ...restaurantDetails,
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
                      value={restaurantDetails?.description}
                      onChange={(e) =>
                        setRestaurantDetails({
                          ...restaurantDetails,
                          description: e.target.value,
                        })
                      }
                      disabled={isLoading ? true : false}
                    />
                  </div>
                  <h1 className="mt-10">قم باضافة صورة للمطعم:</h1>
                  <p className="opacity-60">أظهر لعملائك كيف يبدو المكان</p>
                  <ImageUpload
                    value={restaurantDetails?.imageSrc || []}
                    onChange={(value) =>
                      setRestaurantDetails({
                        ...restaurantDetails,
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
                    {isLoading ? "برجاء الانتظار" : "قم باضافة المطعم"}
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

export default AddRestaurantDialog;
