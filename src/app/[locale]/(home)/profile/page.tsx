import { redirect } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/actions/user.action";
import React from "react";

const page = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return <div className="mt-[120px]">My Profile</div>;
};

export default page;
