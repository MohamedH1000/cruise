import React from "react";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "@/i18n/routing";
import Register from "./components/Register";

const page = async () => {
  const currentUser = await getCurrentUser();
  console.log(currentUser);
  if (currentUser) {
    redirect("/");
  }
  return (
    <div className="flex justify-center items-center min-h-screen mt-[100px] w-full px-5 mb-[50px]">
      <Register />
    </div>
  );
};

export default page;
