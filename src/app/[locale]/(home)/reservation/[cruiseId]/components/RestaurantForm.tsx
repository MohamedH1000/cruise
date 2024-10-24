"use client";
import { useLocale, useTranslations } from "next-intl";
import React, { useState } from "react";

const RestaurantForm = ({
  relatedRestaurants,
  setTotalPrice,
}: {
  relatedRestaurants: any[];
  setTotalPrice: any;
}) => {
  const t = useTranslations();
  const [selectedRestaurants, setSelectedRestaurants] = useState<any[]>([]);
  const locale = useLocale();
  const pricePerRestaurant = 48.9; // Fixed price of 50 SAR for each restaurant

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
  return (
    <div className="p-4">
      <h2 className="font-bold text-xl">
        {t("translations.relatedRestaurant")}
      </h2>
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
