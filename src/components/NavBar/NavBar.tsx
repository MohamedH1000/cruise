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
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import CurrencySelector from "../CurrencySelector";

const NavBar = ({ currentUser, isAdmin, isClient }: any) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  return (
    <header
      className="h-[64px] bg-[#003b95] fixed top-0 z-[50] w-full flex justify-between items-center lg:px-[180px]
    md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <Link href={"/"}>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 100, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* <Image
            src={"/assets/logo.png"}
            alt="Cruise"
            width={150}
            height={50}
          /> */}
          <p className="font-bold text-2xl text-[white]">Private Cruise</p>
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
          <Link
            href={"/admin/restaurants"}
            className={`${
              pathname === "/admin/restaurants"
                ? "border-[1.5px] bg-[#0b152592]"
                : ""
            }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
          >
            {t("cruisesTable.restaurants")}
          </Link>
          <Link
            href={"/admin/reservations"}
            className={`${
              pathname === "/admin/reservations"
                ? "border-[1.5px] bg-[#0b152592]"
                : ""
            }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
          >
            {t("cruisesTable.reservations")}
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
            href={"/about-us"}
            className={`${
              pathname === "/about-us" ? "border-[1.5px] bg-[#0b152592]" : ""
            }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
          >
            {t("translations.aboutus")}
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
            href={"/contact-us"}
            className={`${
              pathname === "/contact-us" ? "border-[1.5px] bg-[#0b152592]" : ""
            }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
          >
            {t("translations.contactus")}
          </Link>
          {/* <Link
            href={"/car-rentals"}
            className={`${
              pathname === "/car-rentals" ? "border-[1.5px] bg-[#0b152592]" : ""
            }  p-2 rounded-[7px] hover:bg-[#0b152592] transition duration-300`}
          >
            {t("NavItems.Car_rentals")}
          </Link> */}
        </motion.nav>
      )}
      <motion.div
        className="flex justify-between items-center gap-2"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 100, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <CurrencySelector />
        <LanguageSelector />
        <div className="gap-2 flex max-md:hidden">
          {currentUser && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer bg-transparent">
                  <AvatarImage
                    src={currentUser?.image}
                    className="rounded-full"
                  />
                  <AvatarFallback className="bg-transparent text-[white] border-[1px] border-[white]">
                    {currentUser?.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content
                className="bg-white rounded-md shadow-lg p-2 space-y-2 transition-all duration-200"
                align="end"
                sideOffset={5}
                style={{
                  animationDuration: "200ms",
                  animationFillMode: "forwards",
                }}
                data-state-open="fadeIn"
                data-state-closed="fadeOut"
              >
                <DropdownMenu.Item>
                  <Link
                    href="/profile"
                    className="block px-2 py-1 text-sm text-gray-700"
                  >
                    {t("Accessibility.myaccount")}
                  </Link>
                </DropdownMenu.Item>
                {currentUser.role === "admin" && (
                  <DropdownMenu.Item>
                    <Link
                      href="/admin"
                      className="block px-2 py-1 text-sm text-gray-700"
                    >
                      {t("Accessibility.controlpanel")}
                    </Link>
                  </DropdownMenu.Item>
                )}
                {currentUser.role === "cruiseOwner" && (
                  <>
                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                    <DropdownMenu.Item>
                      <Link
                        href="/my-cruises"
                        className="block px-2 py-1 text-sm text-gray-700"
                      >
                        {t("translations.myCruises")}
                      </Link>
                    </DropdownMenu.Item>
                  </>
                )}
                {currentUser.role === "cruiseOwner" && (
                  <>
                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                    <DropdownMenu.Item>
                      <Link
                        href="/my-reservations"
                        className="block px-2 py-1 text-sm text-gray-700"
                      >
                        {t("translations.myReservations")}
                      </Link>
                    </DropdownMenu.Item>
                  </>
                )}
                <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                <DropdownMenu.Item
                  className="cursor-pointer px-2 py-1 text-sm text-gray-700"
                  onClick={() => {
                    signOut();
                    toast.success("تم تسجيل الخروج بنجاح");
                  }}
                >
                  {t("Login.logout")}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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
