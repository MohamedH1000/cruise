"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations();

  const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phoneNumber: z.string().min(5).max(14),
    password: z
      .string()
      .min(8, { message: `${t("SignUp.passwordValidationMin")}` })
      .max(20, { message: `${t("SignUp.passwordValidationMax")}` }),
    confirmPassword: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="flex justify-center items-center min-h-screen w-full mt-[64px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border-[1.5px] px-4 py-8 rounded-[14px] shadow-md"
        >
          <h1 className="text-[#003b95] text-center font-bold text-3xl">
            {t("SignUp.header")}
          </h1>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">{t("SignUp.name")}:</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("SignUp.name")}
                    {...field}
                    className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-[500px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">{t("SignUp.email")}:</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("SignUp.email")}
                    {...field}
                    className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-[500px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">
                  {t("SignUp.phonenumber")}:
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("SignUp.phonenumber")}
                    {...field}
                    className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-[500px]"
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
              <FormItem>
                <FormLabel className="text-xl">
                  {t("SignUp.password")}:
                </FormLabel>{" "}
                <FormControl>
                  <Input
                    placeholder={t("SignUp.password")}
                    {...field}
                    className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-[500px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">
                  {t("SignUp.repeat_password")}:
                </FormLabel>{" "}
                <FormControl>
                  <Input
                    placeholder={t("SignUp.repeat_password")}
                    {...field}
                    className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-[500px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <motion.button
            type="submit"
            className="w-full rounded-[12px] bg-[#003b95] text-white mt-8 h-[40px] hover:opacity-75 transition duration-300"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.025 }}
          >
            {t("SignUp.SignUpButton")}
          </motion.button>
        </form>
      </Form>
    </div>
  );
};

export default page;
