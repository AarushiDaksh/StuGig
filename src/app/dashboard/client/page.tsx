// app/dashboard/client/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ClientJobList from "@/components/ClientJobList";
import ClientBidsPanel from "@/components/ClientBidsPanel";
import HiredFreelancers from "@/components/HiredFreelancers";
import PaymentHistory from "@/components/PaymentHistory";
import RatingsGiven from "@/components/RatingGiven";
import { LogOut } from "lucide-react";
import GigUploadForm from "@/components/GigUploadForm";

const TABS = ["Jobs", "Bids", "Hired", "Payments", "Ratings"];

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("Jobs");
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login/client");
      return;
    }
    if (session?.user?.role !== "client") {
      router.push("/login/client");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-100 text-gray-800 py-12 px-6">
        <section className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              Loading Dashboard...
            </h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Client Dashboard</h1>
      <div className="flex gap-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === tab ? "bg-black text-white" : "bg-white border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
        {activeTab === "Jobs" && (
          <div className="mb-8">
            <GigUploadForm />
            <div className="mt-10">
              <ClientJobList />
            </div>
          </div>
        )}

      <div>
        {activeTab === "Bids" && <ClientBidsPanel />}
        {activeTab === "Hired" && <HiredFreelancers />}
        {activeTab === "Payments" && <PaymentHistory />}
        {activeTab === "Ratings" && <RatingsGiven />}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}