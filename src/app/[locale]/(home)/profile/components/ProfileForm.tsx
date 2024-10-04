"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import PhoneInputWithCountrySelect from "react-phone-number-input";

import "react-phone-number-input/style.css";

const ProfileForm = ({ currentUser }: any) => {
  const t = useTranslations();
  const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phoneNumber: z.string().min(4).max(13),
    password: z
      .string()
      .min(8, { message: `${t("SignUp.passwordValidationMin")}` })
      .max(20, { message: `${t("SignUp.passwordValidationMax")}` }),
    confirmPassword: z
      .string()
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // path to field with error
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phoneNumber: currentUser?.phoneNumber || "",
      password: "",
      confirmPassword: "",
    },
  });
  console.log(form.getValues());
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border-[1px] shadow-md p-4 rounded-md"
      >
        <h1 className="font-bold text-3xl">
          {t("translations.accountDetails")}
        </h1>
        <div className="flex max-md:flex-col w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="basis-[48%] max-md:basis-1">
                <FormLabel>{t("SignUp.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("SignUp.name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="basis-[48%]  max-md:basis-1">
                <FormLabel>{t("SignUp.email")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("SignUp.email")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="basis-[48%] max-md:basis-1">
                <FormLabel>{t("SignUp.phonenumber")}</FormLabel>
                <FormControl>
                  <PhoneInputWithCountrySelect
                    {...field}
                    defaultCountry="US"
                    international
                    withCountryCallingCode
                    placeholder={t("SignUp.phonenumber")}
                    required
                    className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-full border-[1px] focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="basis-[48%] max-md:basis-1">
                <FormLabel>{t("SignUp.password")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("SignUp.password")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="basis-[48%] max-md:basis-1">
                <FormLabel>{t("SignUp.repeat_password")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("SignUp.repeat_password")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-20 font-bold text-md">
          {t("translations.save")}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
