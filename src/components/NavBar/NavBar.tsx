"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import LanguageSelector from "../LanguageSelector";
import { Button } from "../ui/button";
import { useRouter } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import MobileNav from "./MobileNav";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  const router = useRouter();
  return (
    <header
      className="h-[64px] bg-[#003b95] fixed top-0 z-50 w-full flex justify-between items-center lg:px-[180px]
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <Link href={"/"}>
        <Image src={"/assets/logo.png"} alt="Cruise" width={150} height={50} />
      </Link>
      <nav className="flex justify-center items-center gap-5 text-white max-lg:gap-2 max-lg:text-[12px] max-sm:hidden">
        <Link
          href={"/"}
          className={`${
            pathname === "/" ? "border-[1.5px] bg-[#0b152592]" : ""
          }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
        >
          {t("NavItems.main")}
        </Link>
        <Link
          href={"/attractions"}
          className={`${
            pathname === "/attractions" ? "border-[1.5px] bg-[#0b152592]" : ""
          }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
        >
          {t("NavItems.attractions")}
        </Link>
        <Link
          href={"/car-rentals"}
          className={`${
            pathname === "/car-rentals" ? "border-[1.5px] bg-[#0b152592]" : ""
          }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
        >
          {t("NavItems.Car_rentals")}
        </Link>
      </nav>
      <div className="flex justify-between items-center gap-2">
        <LanguageSelector />
        <div className="gap-2 flex max-md:hidden">
          <Button
            className="bg-white text-[#003b95] rounded-[12px] hover:opacity-90 transition duration-300"
            onClick={() => router.push("/sign-in")}
          >
            {t("Login.LoginButton")}
          </Button>
          <Button
            className="bg-white text-[#003b95] rounded-[12px] hover:opacity-90 transition duration-300"
            onClick={() => router.push("/sign-up")}
          >
            {t("SignUp.SignUpButton")}
          </Button>
        </div>
      </div>
      <MobileNav open={open} setOpen={setOpen} />
    </header>
  );
};

export default NavBar;
