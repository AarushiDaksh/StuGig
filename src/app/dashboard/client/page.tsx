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
import GigUploadForm from "@/components/GigUploadForm";
import { LogOut, Briefcase, User, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter as useNextRouter } from "next/navigation";
import RateFreelancer from "@/components/RateFreelancer";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [activeTab, setActiveTab] = useState("Jobs");
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "client") {
      router.push("/login/client");
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
  //

  const receiverId = user?.id; // own ID for testing

  return (
        <main className="flex min-h-screen bg-gray-50 text-black">
          <aside className="w-20 bg-white border-r min-h-screen flex flex-col items-center py-8 gap-6">
      <button onClick={() => setActiveTab("Jobs")} title="Gigs">💼</button>
      <button onClick={() => setActiveTab("Bids")} title="Bids">📥</button>
      <button onClick={() => setActiveTab("Ratings")} title="Ratings">⭐</button>

      {/* <button onClick={() => router.push(`/chat`)} title="Chat Room">
        💬
      </button> */}

    </aside>


      <section className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-800">CLIENT</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">Wallet</p>
            <p className="text-lg font-bold">Rs0.00</p>
          </div>
        </div>

        {activeTab === "Jobs" && (
          <>
            <GigUploadForm />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Ongoing Gigs</p>
                <p className="text-2xl font-bold mt-2">No ongoing gigs</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Total Completed Gigs</p>
                <p className="text-2xl font-bold mt-2">0</p>
                <a className="text-sm text-blue-500 mt-1 inline-block" href="#">View All →</a>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="text-2xl font-bold mt-2">Rs0.00</p>
                <a className="text-sm text-blue-500 mt-1 inline-block" href="#">View History →</a>
              </div>
            </div>

            <div className="mt-10">
              <ClientJobList />
            </div>

            <div className="mt-10 bg-white shadow rounded-lg p-6 border">
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
                    <td colSpan={3} className="text-center py-6 text-gray-400">No results.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "Bids" && <ClientBidsPanel />}
        {activeTab === "Hired" && <HiredFreelancers />}
        {activeTab === "Payments" && <PaymentHistory />}
        {activeTab === "Ratings" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Rate Your Freelancer</h2>
          <RateFreelancer
            clientId={session?.user?.id}
            freelancerId={"686628b244f9c02512b17f73"} 
            gigId={"686b389e929f8ca520cbf552"} //hardcoded here 
          />
        </section>
      )}

        {activeTab === "Chat" && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Chat</h2>
            {receiverId && (
              <p className="text-sm text-gray-600">Chat with your freelancers in a dedicated chat room.</p>
            )}
          </section>
        )}

        <div className="text-center mt-10">
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
