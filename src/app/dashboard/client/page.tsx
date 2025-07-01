"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  freelancerId?: {
    _id?: string;
    username?: string;
    email?: string;
  } | null;
}

export default function ClientDashboard() {
  const { data: session } = useSession();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch("/api/gigs/all");
        const data = await res.json();
        setGigs(data.gigs || []);
      } catch (error) {
        console.error("Failed to fetch gigs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return (
    <main className="min-h-screen bg-[#f9fafb] px-6 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-500 mt-2 mb-10 text-lg">Browse and review freelance gigs</p>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading gigs...</p>
        ) : gigs.length === 0 ? (
          <p className="text-gray-400">No gigs available at the moment.</p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {gigs.map((gig) => (
              <article
                key={gig._id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h2>
                <p className="text-gray-600 mb-3 line-clamp-3">{gig.description}</p>
                <p className="text-sm text-green-600 font-medium mb-2">Budget: ₹{gig.budget}</p>
                <p className="text-sm text-gray-500">
                  By: <span className="font-medium">{gig.freelancerId?.username ?? "Unknown"}</span>{" "}
                  ({gig.freelancerId?.email ?? "No email"})
                </p>
              </article>
            ))}
          </section>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-12 inline-block px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
