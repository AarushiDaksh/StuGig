"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccessful } from "@/store/userSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      dispatch(loginSuccessful(session?.user));
      router.replace("/find-talent");
    }
  }, [sessionStatus, session, dispatch, router]);

  const isValidEmail = (email: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements[0] as HTMLInputElement).value;
    const password = (form.elements[1] as HTMLInputElement).value;

    if (!isValidEmail(email)) return setError("Invalid email address");
    if (password.length < 8)
      return setError("Password must be at least 8 characters");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role: "client",
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      setError("");
      router.replace("/find-talent");
    }
  };

  if (sessionStatus === "loading")
    return <h1 className="text-center mt-20">Loading...</h1>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-700">
          Login as Client
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-700"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-gray-700"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500">— OR —</p>
        <Link
          href="/signup/client"
          className="block text-center text-blue-600 hover:underline"
        >
          Register Here
        </Link>
      </div>
    </div>
  );
}
