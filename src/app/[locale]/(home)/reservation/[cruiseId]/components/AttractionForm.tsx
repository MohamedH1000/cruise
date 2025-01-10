"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "@/i18n/routing";

const AttractionForm = ({
  numberOfAttractions,
  availableOptions,
  selectedOptions,
  setAvailableOptions,
  setSelectedOptions,
  currentUser,
}: any) => {
  const t = useTranslations();
  useEffect(() => {
    if (selectedOptions.length !== numberOfAttractions) {
      setSelectedOptions(Array(numberOfAttractions).fill(null));
    }
  }, [numberOfAttractions, selectedOptions.length, setSelectedOptions]);

  const handleSelect = (value: any) => {
    const firstEmptyIndex = selectedOptions.indexOf(null);
    if (firstEmptyIndex !== -1) {
      // Place the selected option in the first empty position
      setSelectedOptions((prev: any) =>
        prev.map((option, index) =>
          index === firstEmptyIndex ? value : option
        )
      );
      setAvailableOptions((prev) => prev.filter((option) => option !== value)); // Remove from available options
    } else {
      alert(
        `${t("translations.limit")} ${numberOfAttractions} ${t(
          "translations.options"
        )}.`
      );
    }
  };
  const handleDelete = (indexToDelete) => {
    // Add the deleted option back to the available options
    setAvailableOptions((prev) => [...prev, selectedOptions[indexToDelete]]);

    // Remove the selected option by setting it to null
    setSelectedOptions((prev) =>
      prev.map((option, index) => (index === indexToDelete ? null : option))
    );
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
    <div className="p-4 mt-2 grid grid-cols-2 max-md:grid-cols-1 gap-3">
      <div>
        <h1 className="font-bold">{t("translations.selectOrder")}</h1>

        {/* Table for available options */}
        <table className="mt-3 w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2" colSpan="2">
                {t("translations.selectOption")}
              </th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
        <p className="text-[gray] text-sm mt-10">
          {t("translations.attractionKnow")}{" "}
          <Link href={"/attractions"} target="_blank">
            <span className="text-blue-600 font-semibold cursor-pointer">
              {t("translations.click")}
            </span>
          </Link>
        </p>
      </div>

      {/* Table for selected options */}
      <div className="max-md:mt-5">
        <h3 className="font-bold">{t("translations.order")}</h3>
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
                <th className="border border-gray-300 p-2">
                  {t("translations.delete")}
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
                    <td className="border border-gray-300 p-2">
                      {selectedOptions[index] && (
                        <button onClick={() => handleDelete(index)}>
                          <RemoveIcon className="text-[red] cursor-pointer" />
                        </button>
                      )}
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
    </div>
  );
};

export default AttractionForm;
