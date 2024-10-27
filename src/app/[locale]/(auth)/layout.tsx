import NavBar from "@/components/NavBar/NavBar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign-(in/up) to the cruise website",
  description: "Sign in and Sign up pages for the website",
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar isClient />
      {children}
    </div>
  );
};

export default layout;
