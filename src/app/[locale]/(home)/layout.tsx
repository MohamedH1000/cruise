import NavBar from "@/components/NavBar/NavBar";
import { getCurrentUser } from "@/lib/actions/user.action";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Private Cruise",
  description: "A website for reserving the cruises and hotels",
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <NavBar currentUser={currentUser} isClient />
      {children}
    </div>
  );
};

export default layout;
