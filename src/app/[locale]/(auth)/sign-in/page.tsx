import React from "react";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "@/i18n/routing";
import Login from "./components/Login";

const page = async () => {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/");
  }
  return (
    <div className="flex justify-center items-center min-h-screen w-full mt-[64px] px-5">
      <Login />
    </div>
  );
};

export default page;
