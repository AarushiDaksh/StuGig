"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Share2, User } from "lucide-react";
import ChatPanel from "@/components/ChatPanel";
import RecommendedJobs from "@/components/RecommendedJobs";
import SkillSwapPage from "@/components/SkillSwap";

export default function FreelancerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileStatus, setProfileStatus] = useState<any>(null);
  const [availableGigs, setAvailableGigs] = useState<any[]>([]);
  const [appliedGigs, setAppliedGigs] = useState<any[]>([]);
  const [completedGigs, setCompletedGigs] = useState<any[]>([]);



  const [walletBalance, setWalletBalance] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);





useEffect(() => {
  if (!userId) return;

  // Fetch wallet balance
  fetch(`/api/freelancer/wallet/balance?userId=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) setWalletBalance(data.balance);
    });

  // Fetch all transactions and filter this month's earnings
  fetch(`/api/freelancer/wallet/transactions?userId=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const now = new Date();
        const earnings = data.transactions
          .filter((txn: any) => {
            const txnDate = new Date(txn.createdAt);
            return txn.type === "credit" &&
              txnDate.getMonth() === now.getMonth() &&
              txnDate.getFullYear() === now.getFullYear();
          })
          .reduce((acc: number, txn: any) => acc + txn.amount, 0);

        setMonthlyEarnings(earnings);
      }
    });
}, [userId]);





  // Fetch profile
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      const res = await fetch(`/api/freelancer/status?id=${userId}`);
      const data = await res.json();
      setProfileStatus(data);
    };
    fetchData();
  }, [userId]);

  // Fetch all gigs (available, applied, completed)
  useEffect(() => {
    if (!userId) return;
    const fetchGigs = async () => {
      try {
        const res = await fetch(`/api/freelancer/gigs?freelancerId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setAvailableGigs(data.availableGigs || []);
          setAppliedGigs(data.appliedGigs || []);
          setCompletedGigs(data.completedGigs || []);
        }
      } catch (err) {
        console.error("Error fetching gigs:", err);
      }
    };
    fetchGigs();
  }, [userId]);

  // Apply to a gig
const handleApply = async (gig: any) => {
  const res = await fetch("/api/freelancer/bid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      gigId: gig._id,
      freelancerId: userId,
      clientId: gig.clientId,
      amount: gig.budget,
    }),
  });

  const data = await res.json();

  if (res.status === 409) {
    alert("You have already applied to this gig.");
    return;
  }

  if (data.success) {
    alert("Bid submitted successfully.");
    router.refresh();
  } else {
    alert("Something went wrong.");
  }
};




  // Mark gig as completed
  const markAsCompleted = async (gigId: string) => {
  try {
    const res = await fetch("/api/freelancer/complete", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gigId }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Marked as completed ✅");
     
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error("Failed to mark as completed:", err);
  }
};


  return (
    <main className="flex min-h-screen bg-gray-50 text-black">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r min-h-screen flex flex-col items-center py-8 gap-6">
        <button onClick={() => setActiveTab("dashboard")} title="Dashboard">📊</button>
        <button onClick={() => setActiveTab("profile")} title="Profile">👤</button>
        <button onClick={() => setActiveTab("gigs")} title="Gigs">💼</button>
        <button onClick={() => setActiveTab("chat")} title="Chat">💬</button>
        <button
          onClick={() => setActiveTab("skillswap")}
          title="SkillSwap"
          className={`${activeTab === "skillswap" ? "text-blue-600 font-bold" : ""}`}
        >
          💱
        </button>

      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-800">FREELANCER</h1>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">Wallet</p>
        <p className="text-lg font-bold">Rs{walletBalance}</p>
      </div>

        </div>


        {activeTab === "skillswap" && (
          <section className="w-full h-full">
            <h2 className="text-2xl font-semibold mb-4">SkillSwap</h2>
            <p className="text-sm text-gray-600 mb-2">
              Swipe right to swap your skills with other freelancers!
            </p>
            <section className="w-full flex justify-center">
              <SkillSwapPage />
            </section>
          </section>
        )}

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 border">
            <p className="text-sm text-gray-500">Total Completed Gigs</p>
            <p className="text-2xl font-bold mt-2">{completedGigs.length}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border">
            <p className="text-sm text-gray-500">Earnings this Month</p>
            <p className="text-2xl font-bold mt-2">Rs{monthlyEarnings}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border">
            <p className="text-sm text-gray-500">Wallet Balance</p>
            <p className="text-2xl font-bold mt-2">Rs{walletBalance}</p>
          </div>
        </div>

            <RecommendedJobs freelancerId={userId as string} />
          </>
        )}

        {/* Profile */}
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
                  router.push(
                    profileStatus.isProfileComplete ? "/profile/edit" : "/profile/create"
                  )
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
              >
                {profileStatus.isProfileComplete ? "Edit Profile" : "Complete Profile"}
              </button>
            </div>
          </section>
        )}

        {/* Chat */}
        {activeTab === "chat" && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Chat</h2>
            <p className="text-sm text-gray-600 mb-2">
              Chat with your connected clients in a dedicated chat room.
            </p>
            <section className="w-full h-[80vh] bg-white shadow-inner rounded-md p-6 border mt-6">
              <ChatPanel role="freelancer" />
            </section>
          </section>
        )}

        {/* Gigs */}
        {activeTab === "gigs" && (
          <section className="space-y-10">
            {/* Available Gigs */}
            <div>
              <h2 className="text-lg font-semibold">Available Gigs</h2>
              {availableGigs.length === 0 ? (
                <p className="text-gray-500">No gigs available at the moment.</p>
              ) : (
                availableGigs.map((gig: any) => (
                  <div key={gig._id} className="bg-white p-6 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-500">
                        Posted on {new Date(gig.createdAt).toLocaleDateString()}
                      </p>
                      <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                        Available
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{gig.title}</h3>
                    <p className="text-gray-700 text-sm mb-2">{gig.description}</p>
                    <p className="text-sm text-gray-500">Budget: ₹{gig.budget.toLocaleString()}</p>
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
            </div>

            {/* Applied Gigs */}
            <div>
              <h2 className="text-lg font-semibold">Applied Gigs</h2>
              {appliedGigs.length === 0 ? (
                <p className="text-gray-500">You haven't applied to any gigs yet.</p>
              ) : (
                appliedGigs.map((gig: any) => (
                  <div key={gig._id} className="bg-gray-100 p-6 border rounded-lg">
                    <h3 className="text-lg font-bold mb-1">{gig.title}</h3>
                    <p className="text-gray-700 text-sm mb-2">{gig.description}</p>
                    <p className="text-sm text-gray-500">
                      Applied on: {new Date(gig.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <button  className="text-green-300"  onClick={() => markAsCompleted(gig._id)}>Mark as Completed</button>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Completed Gigs */}
            <div>
              <h2 className="text-lg font-semibold">Completed Gigs</h2>
              {completedGigs.length === 0 ? (
                <p className="text-gray-500">You have no completed gigs yet.</p>
              ) : (
                completedGigs.map((gig: any) => (
                  <div key={gig._id} className="bg-white p-6 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold mb-1">{gig.title}</h3>
                    <p className="text-gray-700 text-sm mb-2">{gig.description}</p>
                    <p className="text-sm text-gray-500">
                      Completed on: {new Date(gig.updatedAt).toLocaleDateString()}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Completed
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Logout */}
        <div className="text-center mt-10">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </main>
  );
}
