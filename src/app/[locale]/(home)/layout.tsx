import NavBar from "@/components/NavBar/NavBar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cruise Res",
  description: "A website for reserving the cruises and hotels",
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
};

export default layout;
