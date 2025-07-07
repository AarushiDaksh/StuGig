"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import {
  LogOut,
  Briefcase,
  User,
  MessageSquare,
  Share2,
} from "lucide-react";
import RecommendedJobs from "@/components/RecommendedJobs";

interface ProfileStatus {
  isProfileComplete: boolean;
  profile: any;
}

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
  clientId: string;
  applied?: boolean;
}

export default function FreelancerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "gigs">("dashboard");
  const [gigs, setGigs] = useState<Gig[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "freelancer") {
      router.push("/login/freelancer");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchProfileStatus = async () => {
      try {
        const res = await fetch("/api/freelancer/profile/status");
        const data = await res.json();
        setProfileStatus(data);
      } catch (error) {
        console.error("Error fetching profile status:", error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfileStatus();
  }, []);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch(`/api/gigs/all?freelancerId=${session?.user?.id}`);
        const data = await res.json();
        setGigs(data.gigs || []);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    };
    fetchGigs();
  }, []);

  const handleApply = async (gig: Gig) => {
    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gigId: gig._id,
          clientId: gig.clientId,
          freelancerId: session?.user?.id,
          amount: gig.budget,
          proposal: "I'm interested in this gig!",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setGigs((prev) =>
          prev.map((g) => (g._id === gig._id ? { ...g, applied: true } : g))
        );
        alert("Applied successfully!");
      } else {
        alert(data.error || "Failed to apply");
      }
    } catch (error) {
      console.error("Apply error:", error);
      alert("Error applying to gig");
    }
  };

  if (status === "loading" || profileLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center text-black">
        <h1 className="text-xl font-bold">Loading Dashboard...</h1>
      </main>
    );
  }

    const appliedGigs = gigs.filter((g) => g.applied);
  const availableGigs = gigs.filter((g) => !g.applied);
  return (
    <main className="flex min-h-screen bg-gray-50 text-black">
      <aside className="w-20 bg-white border-r min-h-screen flex flex-col items-center py-8 gap-6">
        <button onClick={() => setActiveTab("dashboard")} title="Dashboard">
          <Briefcase />
        </button>
        <button onClick={() => setActiveTab("profile")} title="Profile">
          <User />
        </button>
        <button onClick={() => setActiveTab("gigs")} title="Gigs">
          <MessageSquare />
        </button>
      </aside>

      <section className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-800">FREELANCER</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">Wallet</p>
            <p className="text-lg font-bold">Rs0.00</p>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Total Completed Gigs</p>
                <p className="text-2xl font-bold mt-2">0</p>
                <a className="text-sm text-blue-500 mt-1 inline-block" href="#">View All →</a>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Earnings this Month</p>
                <p className="text-2xl font-bold mt-2">Rs0.00</p>
                <p className="text-xs text-gray-400 mt-1">0% from last month</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="text-2xl font-bold mt-2">Rs0.00</p>
                <a className="text-sm text-blue-500 mt-1 inline-block" href="#">View History →</a>
              </div>
            </div>

            <RecommendedJobs freelancerId={session?.user?.id as string} />

            <div className="bg-white shadow rounded-lg p-6 border mt-10">
              <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400">
                      No results.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "profile" && profileStatus && (
          <section className="bg-white rounded-xl p-6 mb-8 shadow border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} /> Profile Details
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">
                  {profileStatus.isProfileComplete
                    ? "Your profile is complete and visible to clients."
                    : "Complete your profile to start getting hired."}
                </p>
                <div className="text-sm text-gray-500">
                  <p><strong>Skills:</strong> {profileStatus.profile.skills?.join(", ") || "None"}</p>
                  <p><strong>Hourly Rate:</strong> ₹{profileStatus.profile.hourlyRate || "Not set"}</p>
                </div>
              </div>
              <button
                onClick={() =>
                  router.push(profileStatus.isProfileComplete ? "/profile/edit" : "/profile/create")
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                {profileStatus.isProfileComplete ? "Edit Profile" : "Complete Profile"}
              </button>
            </div>
          </section>
        )}

        {activeTab === "gigs" && (
          <section className="space-y-8">
            <h2 className="text-lg font-semibold">Available Gigs</h2>
            {availableGigs.length === 0 ? (
              <p className="text-gray-500">No gigs available at the moment.</p>
            ) : (
              availableGigs.map((gig) => (
                <div key={gig._id} className="bg-white p-6 border rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(gig.createdAt).toLocaleDateString()}
                    </p>
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">Available</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{gig.title}</h3>
                  <p className="text-gray-700 text-sm mb-2">{gig.description}</p>
                  <p className="text-sm text-gray-500">Budget: \u20b1{gig.budget.toLocaleString()}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleApply(gig)}
                      className="px-4 py-2 rounded border text-sm text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Apply
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>
              ))
            )}

            <h2 className="text-lg font-semibold">Applied Gigs</h2>
            {appliedGigs.length === 0 ? (
              <p className="text-gray-500">You haven't applied to any gigs yet.</p>
            ) : (
              appliedGigs.map((gig) => (
                <div key={gig._id} className="bg-gray-100 p-6 border rounded-lg">
                  <h3 className="text-lg font-bold mb-1">{gig.title}</h3>
                  <p className="text-gray-700 text-sm mb-2">{gig.description}</p>
                  <p className="text-sm text-gray-500">Applied on: {new Date(gig.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </section>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </section>
    </main>
  );
}
