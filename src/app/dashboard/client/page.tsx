"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import ClientJobList from "@/components/ClientJobList";
import ClientBidsPanel from "@/components/ClientBidsPanel";
import HiredFreelancers from "@/components/HiredFreelancers";
import PaymentHistory from "@/components/PaymentHistory";
import RatingsGiven from "@/components/RatingGiven";
import GigUploadForm from "@/components/GigUploadForm";
import RateFreelancer from "@/components/RateFreelancer";
import ChatPanel from "@/components/ChatPanel";

import { LogOut } from "lucide-react";


interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  description: string;
  type: "credit" | "debit";
  createdAt: string;
}


export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const router = useRouter();




const [walletBalance, setWalletBalance] = useState(0);
const [transactions, setTransactions] = useState<Transaction[]>([]);

const userId = session?.user?.id;



  const [activeTab, setActiveTab] = useState("jobs");
  const [gigStats, setGigStats] = useState({ ongoing: 0, completed: 0 });
  const [chatFreelancerId, setChatFreelancerId] = useState<string | null>(null);

    useEffect(() => {
      if (status === "loading") return;
      if (status === "unauthenticated" || session?.user?.role !== "client") {
        router.push("/login/client");
      }
    }, [session, status, router]);

        useEffect(() => {
        const fetchStats = async () => {
          if (!session?.user?.id) return;
          const res = await fetch(`/api/client/gigs/status?clientId=${session.user.id}`);
          const data = await res.json();
          if (data.success) {
            setGigStats(data.stats);
          }
        };

        fetchStats();
      }, [session?.user?.id]);



      useEffect(() => {
      if (!userId) return;

      fetch(`/api/wallet/balance?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setWalletBalance(data.balance);
        });

      fetch(`/api/wallet/transactions?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setTransactions(data.transactions);
        });
    }, [userId]);

const handleAddFunds = async () => {
  const res = await fetch("/api/wallet/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount: 1000 }),
  });

  const data = await res.json();

  if (data.success) {
    // Refresh wallet balance
    fetch(`/api/wallet/balance?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setWalletBalance(data.balance);
      });
  } else {
    alert("Failed to add funds.");
  }
};



  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-100 text-gray-800 py-12 px-6">
        <section className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Loading Dashboard...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
        </section>
      </main>
    );
  }
  //

  return (
    <main className="flex min-h-screen bg-gray-50 text-black">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r min-h-screen flex flex-col items-center py-8 gap-6">
        <button onClick={() => setActiveTab("jobs")} title="Jobs">💼</button>
        <button onClick={() => setActiveTab("bids")} title="Bids">📥</button>
        <button onClick={() => setActiveTab("ratings")} title="Ratings">⭐</button>
        <button onClick={() => setActiveTab("chat")} title="Chat">💬</button>
      </aside>

      {/* Main Content */}
              <section className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-xl font-bold text-blue-800">CLIENT</h1>
                  <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">Wallet</p>
          <p className="text-lg font-bold">Rs{walletBalance.toFixed(2)}</p>
          <button
            onClick={handleAddFunds}
            className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            + Add ₹1000
          </button>
        </div>

        </div>


        


        {/* Jobs */}
        {activeTab === "jobs" && (
          <>
            <GigUploadForm />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Ongoing Gigs</p>
                <p className="text-2xl font-bold mt-2">{gigStats.ongoing}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Total Completed Gigs</p>
                <p className="text-2xl font-bold mt-2">{gigStats.completed}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6 border">
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="text-2xl font-bold mt-2">Rs0.00</p>
              </div>
            </div>

            <div className="mt-10">
              <ClientJobList />
            </div>

            <div className="mt-10 bg-white shadow rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
              <table className="w-full text-sm text-left text-gray-600">
                  <thead>
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td className="px-4 py-2" colSpan={3}>No results.</td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td className="px-4 py-2">{new Date(txn.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{txn.description}</td>
                    <td className="px-4 py-2">{txn.type === "credit" ? "+" : "-"}₹{txn.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
                        </table>
            </div>
          </>
        )}

        {/* Bids */}
        {activeTab === "bids" && (
          <ClientBidsPanel onChatClick={(freelancerId) => {
            setChatFreelancerId(freelancerId);
            setActiveTab("chat");
          }} />
        )}

        {/* Ratings */}
        {activeTab === "ratings" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Rate Your Freelancer</h2>
            <RateFreelancer
              clientId={session?.user?.id}
              freelancerId={"686628b244f9c02512b17f73"} // example
              gigId={"686b389e929f8ca520cbf552"} // example
            />
          </section>
        )}

        {/* Chat */}
        {activeTab === "chat" && (
          <>
            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Chat</h2>
              <p className="text-sm text-gray-600">
                Chat with your freelancers in a dedicated chat room.
              </p>
            </section>

            <section className="w-full h-[80vh] bg-white shadow-inner rounded-md p-6 border mt-6">
              <ChatPanel role="client" />
            </section>
          </>
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
      </section>
    </main>
  );
}
