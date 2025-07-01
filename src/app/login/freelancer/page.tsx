"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccessful } from "@/store/userSlice";
import { motion, Variants } from "framer-motion";
import { Loader2, Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function FreelancerLoginForm() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      dispatch(loginSuccessful(session?.user));
      router.replace("/dashboard/freelancer");
    }
  }, [sessionStatus, session, dispatch, router]);

  const handleLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      role: "freelancer",
    });

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful!");
      router.replace("/dashboard/freelancer");
    }

    setIsSubmitting(false);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (sessionStatus === "loading")
    return <h1 className="text-center mt-20">Loading...</h1>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4"
    >
      <Toaster />
      <motion.div
        variants={itemVariants}
        className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 p-8 shadow-lg border border-gray-200 dark:border-zinc-700"
      >
        <motion.h2
          variants={itemVariants}
          className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white"
        >
          Login as Freelancer
        </motion.h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="freelancer@example.com"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          — OR —
        </motion.p>
        <motion.div variants={itemVariants} className="text-center mt-2">
          <Link href="/signup/freelancer" className="text-blue-600 hover:underline">
            Register Here
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
