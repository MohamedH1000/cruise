"use client";
import { CurrencyContext } from "@/app/context/CurrencyContext";
import { Attractions } from "@prisma/client";
import { tr } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import React, { useContext, useState } from "react";

const RestaurantForm = ({
  relatedRestaurants,
  setTotalPrice,
  selectedOptions,
  numberOfAttractions,
  attractions,
}: {
  relatedRestaurants: any[];
  setTotalPrice: any;
  selectedOptions: any;
  numberOfAttractions: any;
  attractions: Attractions;
}) => {
  const { rates } = useContext(CurrencyContext);
  const t = useTranslations();
  const [selectedRestaurants, setSelectedRestaurants] = useState<any[]>([]);
  const locale = useLocale();
  const pricePerRestaurant = 400 / rates.SAR; // Fixed price of 50 SAR for each restaurant
  console.log(relatedRestaurants);
  // Handle selection/deselection of restaurants
  const handleSelectRestaurant = (restaurantId: any) => {
    if (selectedRestaurants.includes(restaurantId)) {
      // Deselect restaurant, subtract price
      setSelectedRestaurants((prev) =>
        prev.filter((id) => id !== restaurantId)
      );
      setTotalPrice((prev: number) => prev - pricePerRestaurant);
    } else {
      // Select restaurant, add price
      setSelectedRestaurants((prev) => [...prev, restaurantId]);
      setTotalPrice((prev: number) => prev + pricePerRestaurant);
    }
  };

  function getOrdinalDay(dayNumber) {
    const ordinals = [
      `${t("translations.first")}`,
      `${t("translations.second")}`,
      `${t("translations.third")}`,
      `${t("translations.forth")}`,
      `${t("translations.fifth")}`,
      `${t("translations.sixth")}`,
      `${t("translations.seventh")}`,
      `${t("translations.eigtht")}`,
      `${t("translations.ninth")}`,
      `${t("translations.tenth")}`,
    ];
    return ordinals[dayNumber - 1] || `${dayNumber}th`; // Fallback for numbers beyond 10
  }
  return (
    <div className="p-4">
      <h2 className="font-bold text-xl">
        {t("translations.relatedRestaurant")}
      </h2>
      <div className="flex justify-between items-start max-md:flex-col ">
        <div className="max-md:mt-5 w-[45%] max-md:w-full">
          {relatedRestaurants && relatedRestaurants.length > 0 ? (
            <table className="mt-3 w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">
                    {t("translations.days")}
                  </th>
                  <th className="border border-gray-300 p-2">
                    {t("translations.selectedOption")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {relatedRestaurants.map((res, index) => {
                  const dayNumber = index + 1;
                  const dayText = `${getOrdinalDay(dayNumber)}`; // e.g., "1st Day", "2nd Day"
                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {t("translations.day") + " " + dayText}
                      </td>
                      <td className="border border-gray-300 p-2 text-sm max-md:text-md">
                        {res.name || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="mt-3 font-bold">{t("translations.noOptions")}</p>
          )}
        </div>
        {relatedRestaurants.length > 0 ? (
          <table className="mt-3 w-[48%] border-collapse border border-gray-300 max-md:w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2" colSpan="2">
                  إضافة وجبة غداء في المعلم
                </th>
                <th className="border border-gray-300 p-2" colSpan="3">
                  اسم المعلم
                </th>
                <th className="border border-gray-300 p-2" colSpan="2">
                  اطلع على المطاعم المتاحة في كل معلم
                </th>
              </tr>
            </thead>
            <tbody>
              {relatedRestaurants.map((option, index) => (
                <tr key={index}>
                  <td
                    className="border border-gray-300 p-2 text-center font-bold"
                    colSpan="1"
                  >
                    400 ريال
                  </td>
                  <td
                    className="border border-gray-300 p-2 flex justify-center items-center"
                    colSpan="1"
                  >
                    <label className="text-md font-semibold">
                      <input
                        type="checkbox"
                        checked={selectedRestaurants.includes(option.id)}
                        onChange={() => handleSelectRestaurant(option.id)}
                      />
                    </label>
                  </td>
                  <td
                    className="border border-gray-300 p-2 font-bold"
                    colSpan="3"
                  >
                    {option?.name}
                  </td>
                  <td
                    className="border border-gray-300 p-2 font-bold"
                    colSpan="2"
                  >
                    {option.restaurants.map((res: any) => res.name).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* <tbody>
              {availableOptions?.map((option, index) => (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(option)}
                >
                  <td className="border border-gray-300 p-2 font-bold whitespace-nowrap">
                    {t("translations.OneDayAttraction")}
                  </td>
                  <td className="border border-gray-300 p-2">{option}</td>
                </tr>
              ))}
            </tbody> */}
          </table>
        ) : (
          <table className="mt-3 w-[48%] border-collapse border border-gray-300 max-md:w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2" colSpan="2">
                  إضافة وجبة غداء في المعلم
                </th>
                <th className="border border-gray-300 p-2" colSpan="3">
                  اطلع على المطاعم المتاحة في كل معلم
                </th>
              </tr>
            </thead>
            <tbody>
              <p className="font-bold text-xl text-center p-3">لا يوجد مطاعم</p>
            </tbody>
          </table>
        )}
      </div>

      {/* <div className="flex items-center gap-3">
        <h1 className="font-bold text-md mt-5">
          {t("translations.driveFees")}
        </h1>
        <input
          type="checkbox"
          checked={true}
          onChange={(prev) => !prev}
          className={`${locale === "ar" ? "ml-2" : "mr-2"}`}
        />
      </div> */}
    </div>
  );
};

export default RestaurantForm;
