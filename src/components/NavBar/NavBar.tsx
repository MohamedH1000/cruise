import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import React from "react";
import LanguageSelector from "../LanguageSelector";

const NavBar = () => {
  const t = useTranslations();

  return (
    <header
      className="h-[64px] bg-[#003b95] fixed top-0 z-50 w-full flex justify-between items-center lg:px-[180px]
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <Link href={"/"}>
        <Image src={"/assets/logo.png"} alt="Cruise" width={150} height={50} />
      </Link>
      <nav className="flex justify-center items-center gap-5 text-white">
        <Link href={"/"}>{t("NavItems.main")}</Link>
        <Link href={"/attractions"}>{t("NavItems.attractions")}</Link>
        <Link href={"/car-rentals"}>{t("NavItems.Car_rentals")}</Link>
      </nav>
      <LanguageSelector />
    </header>
  );
};

export default NavBar;
