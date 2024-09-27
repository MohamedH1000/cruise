"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link, useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader } from "rsuite";

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const t = useTranslations();

  const formSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: `${t("SignUp.passwordValidationMin")}` })
      .max(20, { message: `${t("SignUp.passwordValidationMax")}` }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // console.log(form.getValues());

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loginData = {
      email: values.email,
      password: values.password,
    };
    try {
      setIsLoading(true);
      signIn("credentials", {
        ...loginData,
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          toast.success(`${t("ToastMessages.login")}`);
          router.push("/");
        }

        if (callback?.error) {
          toast.error("حدثت مشكلة اثناء عملية تسجيل الدخول");
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
      setIsLoading(false);
    }
    // console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border-[1.5px] px-4 py-8 rounded-[14px] shadow-md max-w-[500px] w-full"
      >
        <h1 className="text-[#003b95] text-center font-bold text-3xl">
          {t("Login.header")}
        </h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-[22px]">{t("Login.email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("SignUp.email")}
                  {...field}
                  className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-full"
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
            <FormItem className="mt-2">
              <FormLabel className="text-[22px]">
                {t("Login.password")}
              </FormLabel>{" "}
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("SignUp.password")}
                  {...field}
                  className="p-4 placeholder:opacity-65 rounded-[12px] border-[gray] w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <motion.button
          type="submit"
          className="w-full rounded-[12px] bg-[#003b95] mt-8 text-white h-[40px] hover:opacity-75 transition duration-300"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.025 }}
          disabled={isLoading || googleLoading}
        >
          {isLoading ? (
            <>
              <Loader size="md" content={`${t("Login.Loading")}`} />
            </>
          ) : (
            t("Login.LoginButton")
          )}
        </motion.button>
        <Separator className="bg-[gray] mt-4" />
        <motion.button
          disabled={isLoading || googleLoading}
          className="flex justify-center items-center gap-3 w-full mt-4 shadow-md py-2 px-4 rounded-[12px]
    text-[18px] font-semibold border-[1px]"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.025 }}
        >
          <FcGoogle />
          {t("Login.logingoogle")}
        </motion.button>
        <div className="mt-4 flex justify-center items-center gap-3">
          <p>{t("Login.noaccount")}</p>
          <Link href={"/sign-up"}>
            <p className="font-bold hover:underline">{t("Login.signup")}</p>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default Login;
