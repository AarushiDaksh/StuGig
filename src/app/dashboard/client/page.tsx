// app/freelancer/page.tsx or app/client/page.tsx
"use client";

import { signOut, useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">
        {session?.user?.role === "freelancer" ? "Find Work" : "Find Talent"}
      </h1>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
