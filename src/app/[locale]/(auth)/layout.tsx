import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign-(in/up) to the cruise website",
  description: "Sign in and Sign up pages for the website",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;
