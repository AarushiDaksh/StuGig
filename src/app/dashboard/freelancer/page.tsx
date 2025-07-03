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
    <main className="min-h-screen bg-white text-black py-6 px-4 font-sans">
      <section className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl mb-1 font-medium">Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Welcome back, <span>{user?.name || "Freelancer"}</span> 👋
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Analytics */}
            <section className="bg-gray-100 rounded-lg p-4 mb-6">
              <h2 className="text-base text-gray-700 mb-3">Upload New Gig</h2>
              <GigUploadForm />
            </section>

            {/* Gig List */}
            <section>
              <h2 className="text-base text-gray-700 mb-4">Your Posted Gigs</h2>
              {loading ? (
                <p className="text-gray-500 text-sm">Loading gigs...</p>
              ) : gigs.length === 0 ? (
                <p className="text-gray-400 text-sm">You haven't posted any gigs yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gigs.map((gig) => (
                    <div
                      key={gig._id}
                      className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-sm transition"
                    >
                      <h3 className="text-base font-normal text-black mb-1">{gig.title}</h3>
                      <p className="text-sm text-gray-700 line-clamp-3">{gig.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                        <span>₹{gig.budget}</span>
                        <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="mb-4">
              <img
                src="/avatar-placeholder.png"
                alt="User Avatar"
                className="w-16 h-16 mx-auto rounded-full mb-2"
              />
              <p className="text-sm font-medium text-black">{user?.name || "John Doe"}</p>
              <p className="text-xs text-gray-500">Your Profile</p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full bg-gray-200 text-sm text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <LogOut size={16} /> Logout
                </div>
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
