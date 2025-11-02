"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, Variants } from "framer-motion";
import { Loader2, Mail, Lock, SmilePlus, UserPlus } from "lucide-react";
import { toast, Toaster } from "sonner";
import Link from "next/link";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type SignupFormValues = z.infer<typeof signupSchema>;

export default function UserSignupPage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    if (sessionStatus === "authenticated") router.replace("/");
  }, [sessionStatus, router]);

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.status === 409) toast.error("Email already registered");
      else if (!res.ok) toast.error("Something went wrong");
      else {
        toast.success("Account created!", { description: "Redirecting to login..." });
        router.push("/login/User");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
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
          Create Your Account
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <motion.div variants={item} className="space-y-1">
            <label className="text-sm font-medium text-blue-700">Username</label>
            <div className="relative">
              <SmilePlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="text"
                placeholder="yourname"
                {...register("username")}
                className="w-full rounded-md border border-blue-200 bg-blue-50 pl-10 pr-3 py-2 text-sm text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
            </div>
            {errors.username && <p className="text-xs text-red-600">{errors.username.message}</p>}
          </motion.div>

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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Register
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
          <Link href="/login/User" className="text-sm font-medium text-blue-700 hover:underline">
            Login with an existing account
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
