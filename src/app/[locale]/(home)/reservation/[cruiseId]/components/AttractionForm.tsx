"use client";
import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "@/i18n/routing";

const AttractionForm = ({
  numberOfAttractions,
  availableOptions,
  selectedOptions,
  setAvailableOptions,
  setSelectedOptions,
}: any) => {
  const t = useTranslations();
  const handleSelect = (value: any) => {
    if (selectedOptions.length < numberOfAttractions) {
      setSelectedOptions((prev: any) => [...prev, value]); // Set the selected option
      setAvailableOptions((prev: any) =>
        prev.filter((option: any) => option !== value)
      ); // Remove it from the available options
    } else {
      alert(
        `${t("translations.limit")} ${numberOfAttractions} ${t(
          "translations.options"
        )}.`
      );
    }
  };

  const handleDelete = (optionToDelete) => {
    setAvailableOptions((prev: any) => [...prev, optionToDelete]); // Remove the item from the list
    setSelectedOptions((prev: any) =>
      prev.filter((option) => option !== optionToDelete)
    );
  };

  return (
    <div className="p-4 mt-2">
      <h1 className="font-bold">{t("translations.selectOrder")}</h1>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="mt-3"></SelectTrigger>
        <SelectContent>
          {availableOptions.map((option: any) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-5">
        <h3 className="font-bold">{t("translations.order")}</h3>
        {selectedOptions && selectedOptions.length > 0 ? (
          <ol className="mt-3 flex flex-col gap-3">
            {selectedOptions.map((option, index) => (
              <li key={index} className="flex justify-between items-center">
                <p>
                  {index + 1}. {option}
                </p>
                <button onClick={() => handleDelete(option)}>
                  <RemoveIcon className="text-[red] cursor-pointer" />
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 font-bold">{t("translations.noOptions")}</p>
        )}
        <p className="text-[gray] text-sm mt-10">
          {t("translations.attractionKnow")}{" "}
          <Link href={"/attractions"} target="_blank">
            <span className="text-blue-600 font-semibold cursor-pointer">
              {t("translations.click")}
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AttractionForm;
