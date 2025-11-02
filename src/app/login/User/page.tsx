"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Loader2, Mail, Lock, LogIn } from "lucide-react";
import { toast, Toaster } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function UserLoginPage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) toast.error("Invalid email or password");
    else {
      toast.success("Login successful!");
      router.replace("/");
    }
    setIsSubmitting(false);
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  if (sessionStatus === "loading")
    return <h1 className="mt-20 text-center text-blue-700">Loading...</h1>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4"
    >
      <Toaster richColors />
      <motion.div
        variants={item}
        className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-8 shadow-lg"
      >
        {/* Rolio Logo */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-lg font-bold text-white shadow-sm">
            R
          </div>
          <h1 className="text-2xl font-bold text-blue-700">Rolio</h1>
        </div>

        <motion.h2 variants={item} className="mb-6 text-center text-xl font-semibold text-blue-700">
          Login to Your Account
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <motion.div variants={item} className="space-y-1">
            <label className="text-sm font-medium text-blue-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="email"
                placeholder="user@example.com"
                {...register("email")}
                className="w-full rounded-md border border-blue-200 bg-blue-50 pl-10 pr-3 py-2 text-sm text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </motion.div>

          {/* Password */}
          <motion.div variants={item} className="space-y-1">
            <label className="text-sm font-medium text-blue-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="password"
                placeholder="********"
                {...register("password")}
                className="w-full rounded-md border border-blue-200 bg-blue-50 pl-10 pr-3 py-2 text-sm text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </motion.div>

          {/* Submit */}
          <motion.div variants={item}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </motion.div>
        </form>

        {/* Divider + Link */}
        <motion.p variants={item} className="mt-6 text-center text-sm text-blue-600">
          — OR —
        </motion.p>
        <motion.div variants={item} className="mt-2 text-center">
          <a href="/signup/User" className="text-sm font-medium text-blue-700 hover:underline">
            Register Here
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
