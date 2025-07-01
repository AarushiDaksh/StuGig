"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { RootState } from "@/store";
import GigUploadForm from "@/components/GigUploadForm";
import { LogOut, Briefcase } from "lucide-react";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
}

export default function FreelancerDashboard() {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  useEffect(() => {
    const fetchGigs = async () => {
      if (!user?.id) return;
      const res = await fetch(`/api/gigs/freelancer/${user.id}`);
      const data = await res.json();
      setGigs(data.gigs || []);
      setLoading(false);
    };
    fetchGigs();
  }, [user?.id]);

  return (
    <main className="min-h-screen bg-[#0e0e10] text-white py-12 px-6">
      <section className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Freelancer Dashboard</h1>
          <p className="text-gray-400 mt-2">
            Hello <span className="font-semibold">{user?.name || "Freelancer"}</span> — Manage your gigs efficiently.
          </p>
        </header>

        {/* Gig Upload */}
        <section className="bg-[#1c1c1e] rounded-xl p-6 mb-12 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase size={22} /> Upload New Gig
          </h2>
          <GigUploadForm />
        </section>

        {/* Gig List */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Posted Gigs</h2>

          {loading ? (
            <p className="text-gray-400">Loading gigs...</p>
          ) : gigs.length === 0 ? (
            <p className="text-gray-500">You haven't posted any gigs yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <article
                  key={gig._id}
                  className="bg-[#1a1a1d] p-5 rounded-xl shadow border border-gray-800 hover:border-blue-500 transition"
                >
                  <h3 className="text-xl font-bold text-white">{gig.title}</h3>
                  <p className="text-gray-300 mt-1 line-clamp-3">{gig.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                    <span>Budget: <span className="text-green-400 font-medium">₹{gig.budget}</span></span>
                    <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Logout Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </section>
    </main>
  );
}
