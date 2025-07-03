"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
// import GigUploadForm from "@/components/GigUploadForm";
import {
  LogOut,
  Briefcase,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
}

interface ProfileStatus {
  isProfileComplete: boolean;
  profile: any;
}

export default function FreelancerDashboard() {
  const { data: session, status } = useSession();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(
    null
  );
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (status === "unauthenticated") {
      router.push("/login/freelancer");
      return;
    }
    if (session?.user?.role !== "freelancer") {
      router.push("/login/freelancer");
      return;
    }
  }, [session, status, router]);

  // Check profile completion status
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/freelancer/profile/status");
        if (response.ok) {
          const data = await response.json();
          setProfileStatus(data);

          // If profile is not complete, redirect to profile creation
          if (!data.isProfileComplete) {
            router.push("/profile/create");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    checkProfileStatus();
  }, [session?.user?.id, router]);

  useEffect(() => {
    const fetchGigs = async () => {
      if (!session?.user?.id) return;
      const res = await fetch(`/api/gigs/freelancer/${session.user.id}`);
      const data = await res.json();
      setGigs(data.gigs || []);
      setLoading(false);
    };
    fetchGigs();
  }, [session?.user?.id]);

  // Show loading state while checking session or profile
  if (status === "loading" || profileLoading) {
    return (
      <main className="min-h-screen bg-[#0e0e10] text-white py-12 px-6">
        <section className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              Loading Dashboard...
            </h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black py-6 px-4 font-sans">
      <section className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Freelancer Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Hello{" "}
            <span className="font-semibold">
              {profileStatus?.profile?.firstName
                ? `${profileStatus.profile.firstName} ${profileStatus.profile.lastName}`
                : session?.user?.name || "Freelancer"}
            </span>{" "}
            — Manage your gigs efficiently.
          </p>

          {/* Profile Status Indicator */}
          {profileStatus && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {profileStatus.isProfileComplete ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle size={16} />
                  <span className="text-sm">Profile Complete</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertCircle size={16} />
                  <span className="text-sm">Profile Incomplete</span>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Profile Management */}
        <section className="bg-[#1c1c1e] rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <User size={22} /> Profile Management
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 mb-2">
                {profileStatus?.isProfileComplete
                  ? "Your profile is complete and visible to clients."
                  : "Complete your profile to start getting hired."}
              </p>
              {profileStatus?.profile && (
                <div className="text-sm text-gray-400">
                  <p>
                    Skills: {profileStatus.profile.skills?.join(", ") || "None"}
                  </p>
                  <p>
                    Hourly Rate: ₹
                    {profileStatus.profile.hourlyRate || "Not set"}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() =>
                router.push(
                  profileStatus?.isProfileComplete
                    ? "/profile/edit"
                    : "/profile/create"
                )
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              {profileStatus?.isProfileComplete
                ? "Edit Profile"
                : "Complete Profile"}
            </button>
          </div>
        </section>

        {/* Gig Upload */}
        {/* <section className="bg-[#1c1c1e] rounded-xl p-6 mb-12 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase size={22} /> Upload New Gig
          </h2>
          <GigUploadForm />
        </section> */}

        {/* Gig List */}
        {/* <section>
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
                  <p className="text-gray-300 mt-1 line-clamp-3">
                    {gig.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                    <span>
                      Budget:{" "}
                      <span className="text-green-400 font-medium">
                        ₹{gig.budget}
                      </span>
                    </span>
                    <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section> */}

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
