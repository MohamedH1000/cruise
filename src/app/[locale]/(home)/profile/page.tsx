import { redirect } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/actions/user.action";
import React from "react";
import ProfileForm from "./components/ProfileForm";

const page = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <div
      className="mt-[120px] lg:px-[180px]
  md:px-[50px] max-sm:px-[10px] max-md:px-[50px]"
    >
      <ProfileForm currentUser={currentUser} />
    </div>
  );
};

export default page;
