"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Signup() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const username = (form.elements[0] as HTMLInputElement).value;
    const email = (form.elements[1] as HTMLInputElement).value;
    const password = (form.elements[2] as HTMLInputElement).value;

    if (!username || username.length < 3)
      return setError("Username must be at least 3 characters");
    if (!isValidEmail(email)) return setError("Email is invalid");
    if (password.length < 8)
      return setError("Password must be at least 8 characters");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role: "client" }),
      });

      if (res.status === 409)
        return setError("This email is already registered");
      if (!res.ok) return setError("Something went wrong. Please try again");

      setError("");
      router.push("/login/client");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }
  };

  if (sessionStatus === "loading")
    return <h1 className="text-center mt-20">Loading...</h1>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-700">
          Register as Client
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            required
            className="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-gray-700"
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-gray-700"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-gray-700"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-500">— OR —</p>
        <Link
          href="/login/client"
          className="block text-center text-blue-600 hover:underline"
        >
          Login with an existing account
        </Link>
      </div>
    </div>
  );
}
