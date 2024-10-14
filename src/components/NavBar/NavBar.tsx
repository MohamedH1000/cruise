"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import LanguageSelector from "../LanguageSelector";
import { Button } from "../ui/button";
import { usePathname } from "@/i18n/routing";
import MobileNav from "./MobileNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const NavBar = ({ currentUser, isAdmin, isClient }: any) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  return (
    <header
      className="h-[64px] bg-[#003b95] fixed top-0 z-[1000] w-full flex justify-between items-center lg:px-[180px]
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <Link href={"/"}>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 100, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Image
            src={"/assets/logo.png"}
            alt="Cruise"
            width={150}
            height={50}
          />
        </motion.div>
      </Link>
      {isAdmin && (
        <motion.nav
          className="flex justify-center items-center gap-5 text-white max-lg:gap-2 max-lg:text-[12px] max-sm:hidden"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 100, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Link
            href={"/admin"}
            className={`${
              pathname === "/admin" ? "border-[1.5px] bg-[#0b152592]" : ""
            }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
          >
            {t("Accessibility.attractions")}
          </Link>
          <Link
            href={"/admin/users"}
            className={`${
              pathname === "/admin/users" ? "border-[1.5px] bg-[#0b152592]" : ""
            }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
          >
            {t("Accessibility.users")}
          </Link>
          <Link
            href={"/admin/cruises"}
            className={`${
              pathname === "/admin/cruises"
                ? "border-[1.5px] bg-[#0b152592]"
                : ""
            }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
          >
            {t("Accessibility.cruises")}
          </Link>
        </motion.nav>
      )}
      {isClient && (
        <motion.nav
          className="flex justify-center items-center gap-5 text-white max-lg:gap-2 max-lg:text-[12px] max-sm:hidden"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 100, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
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
        </motion.nav>
      )}
      <motion.div
        className="flex justify-between items-center gap-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 100, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <LanguageSelector />
        <div className="gap-2 flex max-md:hidden">
          {currentUser && (
            <Menubar className="border-none" dir="rtl">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer">
                  <Avatar>
                    <AvatarImage src={currentUser?.image} />
                    <AvatarFallback>
                      {currentUser?.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </MenubarTrigger>
                <MenubarContent className="bg-white">
                  <Link href={"/profile"}>
                    <MenubarItem className="cursor-pointer">
                      {t("Accessibility.myaccount")}
                    </MenubarItem>
                  </Link>
                  <MenubarSeparator className="bg-[gray]" />
                  {currentUser.role === "admin" && (
                    <>
                      <Link href={"/admin"}>
                        <MenubarItem className="cursor-pointer">
                          {t("Accessibility.controlpanel")}
                        </MenubarItem>
                      </Link>
                      <MenubarSeparator className="bg-[gray]" />
                    </>
                  )}
                  <MenubarItem
                    className="cursor-pointer"
                    onClick={() => {
                      signOut();
                      toast.success("تم تسجيل الخروج بنجاح");
                    }}
                  >
                    {t("Login.logout")}
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )}
          {!currentUser && (
            <>
              <Link href={"/sign-in"}>
                <Button className="bg-white text-[#003b95] rounded-[12px] hover:opacity-90 transition duration-300">
                  {t("Login.LoginButton")}
                </Button>
              </Link>
              <Link href={"/sign-up"}>
                <Button className="bg-white text-[#003b95] rounded-[12px] hover:opacity-90 transition duration-300">
                  {t("SignUp.SignUpButton")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </motion.div>
      {isAdmin && (
        <MobileNav
          open={open}
          setOpen={setOpen}
          currentUser={currentUser}
          isClient={false}
          isAdmin={true}
        />
      )}
      {isClient && (
        <MobileNav
          open={open}
          setOpen={setOpen}
          currentUser={currentUser}
          isClient={true}
          isAdmin={false}
        />
      )}
    </header>
  );
};

export default NavBar;
