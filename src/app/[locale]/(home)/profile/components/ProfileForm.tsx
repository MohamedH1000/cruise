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
import ImageUpload from "@/components/imageUpload/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editUser } from "@/lib/actions/user.action";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";

const ProfileForm = ({ currentUser }: any) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().min(4).max(13).optional(),
    accountRole: z.string().optional(),
    password: z
      .string()
      .max(20, { message: `${t("SignUp.passwordValidationMax")}` })
      .optional(),
    confirmPassword: z
      .string()
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // path to field with error
      })
      .optional(),
    image: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phoneNumber: currentUser?.phoneNumber || "",
      password: "",
      confirmPassword: "",
      accountRole: currentUser?.role || "",
      image: "",
    },
  });
  console.log(form.getValues());
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await editUser(values);
      toast.success(t("translations.updatePersonalSuccess"));
    } catch (error) {
      console.log(error);
      toast.error(t("translations.updatePersonalError"));
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border-[1px] shadow-md p-4 rounded-md mb-10"
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
            name="accountRole"
            render={({ field }) => (
              <FormItem className="basis-[48%]">
                <FormLabel className="text-xl">
                  {t("SignUp.accountRole")}:
                </FormLabel>{" "}
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={currentUser?.role === "admin"}
                  >
                    <SelectTrigger className="w-full rounded-[12px]">
                      <SelectValue
                        placeholder={`${t("SignUp.accountRole")}`}
                        className="placeholder:opacity-30"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white cursor-pointer rounded-[12px] z-30">
                      <SelectItem value="client" className="cursor-pointer">
                        {t("chooseAccountType.client")}
                      </SelectItem>
                      <SelectItem
                        value="cruiseOwner"
                        className="cursor-pointer"
                      >
                        {t("chooseAccountType.cruiseOwner")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="basis-[48%]">
                <FormLabel>قم برفع او تغيير الصورة الشخصية</FormLabel>
                <FormControl>
                  <ImageUpload
                    currentUser={currentUser}
                    value={field.value}
                    onChange={field.onChange}
                    profile
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="mt-20 font-bold text-md"
          disabled={isLoading}
        >
          {t("translations.save")}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
