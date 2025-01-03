"use client";
import { CurrencyContext } from "@/app/context/CurrencyContext";
import { useLocale, useTranslations } from "next-intl";
import React, { useContext, useState } from "react";

const RestaurantForm = ({
  relatedRestaurants,
  setTotalPrice,
  selectedOptions,
  numberOfAttractions,
}: {
  relatedRestaurants: any[];
  setTotalPrice: any;
  selectedOptions: any;
  numberOfAttractions: any;
}) => {
  const { rates } = useContext(CurrencyContext);
  const t = useTranslations();
  const [selectedRestaurants, setSelectedRestaurants] = useState<any[]>([]);
  const locale = useLocale();
  const pricePerRestaurant = 50 / rates.SAR; // Fixed price of 50 SAR for each restaurant

  // Handle selection/deselection of restaurants
  const handleSelectRestaurant = (restaurant: any) => {
    if (selectedRestaurants.includes(restaurant)) {
      // Deselect restaurant, subtract price
      setSelectedRestaurants((prev) =>
        prev.filter((r) => r.id !== restaurant.id)
      );
      setTotalPrice((prev: number) => prev - pricePerRestaurant);
    } else {
      // Select restaurant, add price
      setSelectedRestaurants((prev) => [...prev, restaurant]);
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
      <div className="flex justify-between items-start max-md:flex-col">
        <div className="max-md:mt-5 w-[45%] max-md:w-full">
          {selectedOptions && selectedOptions.length > 0 ? (
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
                {Array.from({ length: numberOfAttractions }, (_, index) => {
                  const dayNumber = index + 1;
                  const dayText = `${getOrdinalDay(dayNumber)}`; // e.g., "1st Day", "2nd Day"
                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        {t("translations.day") + " " + dayText}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {selectedOptions[index] || "-"}
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
          <ul className="restaurant-list mt-3">
            {relatedRestaurants?.map((restaurant: any) => (
              <li key={restaurant.id} className="restaurant-item mt-2">
                <label className="text-md font-semibold">
                  <input
                    type="checkbox"
                    checked={selectedRestaurants.includes(restaurant)}
                    onChange={() => handleSelectRestaurant(restaurant)}
                    className={`${locale === "ar" ? "ml-2" : "mr-2"}`}
                  />
                  {restaurant.name}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5">No related restaurants found.</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <h1 className="font-bold text-md mt-5">
          {t("translations.driveFees")}
        </h1>
        <input
          type="checkbox"
          checked={true}
          onChange={(prev) => !prev}
          className={`${locale === "ar" ? "ml-2" : "mr-2"}`}
        />
      </div>
    </div>
  );
};

export default RestaurantForm;
