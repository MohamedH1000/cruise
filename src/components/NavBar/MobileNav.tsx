import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import LanguageSelector from "../LanguageSelector";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import CurrencySelector from "../CurrencySelector";

interface MobileNavProps {
  open: Boolean;
  setOpen: any;
  currentUser: any;
  isAdmin: Boolean;
  isClient: Boolean;
}
const MobileNav: React.FC<MobileNavProps> = ({
  open,
  setOpen,
  currentUser,
  isAdmin,
  isClient,
}) => {
  const pathname = usePathname();
  const t = useTranslations();
  return (
    <div className="md:hidden">
      {open ? (
        <Image
          src={"/assets/icons/close.png"}
          alt="close"
          height={50}
          width={20}
          className="absolute top-[100px] z-[60] right-[40px]"
          onClick={() => setOpen((prev: any) => !prev)}
        />
      ) : (
        <Image
          src={"/assets/icons/hamburger.svg"}
          alt="menu"
          height={50}
          width={40}
          onClick={() => setOpen((prev: any) => !prev)}
        />
      )}
      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          exit={{ opacity: 0 }}
          className="flex flex-col justify-center
    items-start gap-5 text-[20px]  bg-white py-10 
    shadow-md px-10 absolute
    top-[64px] right-0 w-full z-10 max-sm:top-[64px] pt-20"
        >
          {isClient && (
            <>
              <Link
                href={"/"}
                className={`${
                  pathname === "/"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
                onClick={() => setOpen((prev: any) => !prev)}
              >
                {t("NavItems.main")}
              </Link>
              <Link
                href={"/profile"}
                className={`${
                  pathname === "/profile"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
                onClick={() => setOpen((prev: any) => !prev)}
              >
                {t("Accessibility.myaccount")}
              </Link>
              {currentUser?.role === "admin" && (
                <Link
                  href={"/admin"}
                  className={`${
                    pathname === "/admin"
                      ? "bg-[#003b95] text-white"
                      : "hover:bg-[#c3bbbb] text-black"
                  } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
                  onClick={() => setOpen((prev: any) => !prev)}
                >
                  {t("Accessibility.controlpanel")}
                </Link>
              )}
              <Link
                href={"/attractions"}
                className={`${
                  pathname === "/attractions"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
                onClick={() => setOpen((prev: any) => !prev)}
              >
                {t("NavItems.attractions")}
              </Link>
              <Link
                href={"/car-rentals"}
                className={`${
                  pathname === "/car-rentals"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
                onClick={() => setOpen((prev: any) => !prev)}
              >
                {t("NavItems.Car_rentals")}
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                href={"/admin/users"}
                className={`${
                  pathname === "/admin/users"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
              >
                {t("Accessibility.users")}
              </Link>
              <Link
                href={"/admin/cruises"}
                className={`${
                  pathname === "/admin/cruises"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
              >
                {t("Accessibility.cruises")}
              </Link>
              <Link
                href={"/admin"}
                className={`${
                  pathname === "/admin"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
              >
                {t("Accessibility.attractions")}
              </Link>
              <Link
                href={"/admin/restaurants"}
                className={`${
                  pathname === "/admin/restaurants"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px] sm:hidden`}
              >
                {t("cruisesTable.restaurants")}
              </Link>
            </>
          )}
          <div className="z-[120] relative">
            <LanguageSelector isMobile />
          </div>
          <Separator className="bg-[gray] w-full h-[1px] sm:hidden" />
          <div className="z-[120] relative">
            <CurrencySelector isMobile />
          </div>
          <Separator className="bg-[gray] w-full h-[1px] sm:hidden" />
          {currentUser ? (
            <Button
              className="w-full  px-4 py-4 rounded-[12px] flex justify-start text-[16px]"
              onClick={() => {
                signOut();
                toast.success(`${t("ToastMessages.signout")}`);
              }}
            >
              {t("Login.logout")}
            </Button>
          ) : (
            <>
              <Link
                href={"/sign-in"}
                className={`${
                  pathname === "/sign-in"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px]`}
                onClick={() => setOpen((prev: any) => !prev)}
              >
                {t("Login.LoginButton")}
              </Link>
              <Link
                href={"/sign-up"}
                className={`${
                  pathname === "/sign-up"
                    ? "bg-[#003b95] text-white"
                    : "hover:bg-[#c3bbbb] text-black"
                } w-full  px-4 py-2 rounded-[12px]`}
                onClick={() => setOpen((prev: any) => !prev)}
              >
                {t("SignUp.SignUpButton")}
              </Link>
            </>
          )}
        </motion.nav>
      )}
    </div>
  );
};

export default MobileNav;
