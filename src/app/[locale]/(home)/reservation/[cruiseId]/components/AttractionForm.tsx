// "use client";
// import React from "react";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { useTranslations } from "next-intl";
// import RemoveIcon from "@mui/icons-material/Remove";
// import { Link } from "@/i18n/routing";

// const AttractionForm = ({
//   numberOfAttractions,
//   availableOptions,
//   selectedOptions,
//   setAvailableOptions,
//   setSelectedOptions,
// }: any) => {
//   const t = useTranslations();
//   const handleSelect = (value: any) => {
//     if (selectedOptions.length < numberOfAttractions) {
//       setSelectedOptions((prev: any) => [...prev, value]); // Set the selected option
//       setAvailableOptions((prev: any) =>
//         prev.filter((option: any) => option !== value)
//       ); // Remove it from the available options
//     } else {
//       alert(
//         `${t("translations.limit")} ${numberOfAttractions} ${t(
//           "translations.options"
//         )}.`
//       );
//     }
//   };

//   const handleDelete = (optionToDelete) => {
//     setAvailableOptions((prev: any) => [...prev, optionToDelete]); // Remove the item from the list
//     setSelectedOptions((prev: any) =>
//       prev.filter((option) => option !== optionToDelete)
//     );
//   };

//   return (
//     <div className="p-4 mt-2">
//       <h1 className="font-bold">{t("translations.selectOrder")}</h1>
//       <Select onValueChange={handleSelect}>
//         <SelectTrigger className="mt-3"></SelectTrigger>
//         <SelectContent>
//           {availableOptions.map((option: any) => (
//             <SelectItem key={option} value={option}>
//               {option}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <div className="mt-5">
//         <h3 className="font-bold">{t("translations.order")}</h3>
//         {selectedOptions && selectedOptions.length > 0 ? (
//           <ol className="mt-3 flex flex-col gap-3">
//             {selectedOptions.map((option, index) => (
//               <li key={index} className="flex justify-between items-center">
//                 <p>
//                   {index + 1}. {option}
//                 </p>
//                 <button onClick={() => handleDelete(option)}>
//                   <RemoveIcon className="text-[red] cursor-pointer" />
//                 </button>
//               </li>
//             ))}
//           </ol>
//         ) : (
//           <p className="mt-3 font-bold">{t("translations.noOptions")}</p>
//         )}
//         <p className="text-[gray] text-sm mt-10">
//           {t("translations.attractionKnow")}{" "}
//           <Link href={"/attractions"} target="_blank">
//             <span className="text-blue-600 font-semibold cursor-pointer">
//               {t("translations.click")}
//             </span>
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AttractionForm;

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

  return (
    <div className="p-4 mt-2 grid grid-cols-2 max-md:grid-cols-1 gap-3">
      <div>
        <h1 className="font-bold">{t("translations.selectOrder")}</h1>

        {/* Table for available options */}
        <table className="mt-3 w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">
                {t("translations.selectOption")}
              </th>
            </tr>
          </thead>
          <tbody>
            {availableOptions.map((option, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(option)}
              >
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
                  {t("translations.orderNumber")}
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
              {Array.from({ length: numberOfAttractions }, (_, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
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
              ))}
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
