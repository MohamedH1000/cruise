import { Link } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/actions/user.action";
import { getTranslations } from "next-intl/server";
import React from "react";

const page = async () => {
  const currentUser = await getCurrentUser();
  const t = await getTranslations();

  if (currentUser?.role !== "admin") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-3">
        <p className="font-bold text-3xl ">{t("Accessibility.noadmin")}</p>
        <Link
          href={"/"}
          className="bg-[#003b95] text-white rounded-[12px] shadow-md hover:scale-110 transition duration-300 px-4 py-2 mt-5"
        >
          {t("Accessibility.backMain")}
        </Link>
      </div>
    );
  }
  return <div>page</div>;
};

export default page;
