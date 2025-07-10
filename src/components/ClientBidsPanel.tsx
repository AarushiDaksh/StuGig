"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare } from "lucide-react";

interface Bid {
  _id: string;
  bidAmount: number | null;
  proposal: string;
  status?: "pending" | "accepted" | "rejected";
  freelancerId: {
    _id: string;
    username: string;
    email: string;
  };
  gigId: {
    _id: string;
    title: string;
  } | null;
}

export default function ClientBidsPanel({
  onChatClick,
}: {
  onChatClick?: (freelancerId: string) => void;
}) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch("/api/client/bids");
        if (!res.ok) throw new Error("Failed to fetch bids");

        const data = await res.json();
        setBids(data.bids || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bids.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const handleBidAction = async (bidId: string, action: "accepted" | "rejected") => {
    try {
      const res = await fetch(`/api/client/bids/${bidId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      const data = await res.json();
      if (data.success) {
        setBids((prev) =>
          prev.map((b) => (b._id === bidId ? { ...b, status: action } : b))
        );
      }
    } catch (error) {
      console.error("Failed to update bid status", error);
    }
  };

  if (loading) return <p className="text-gray-500">Loading bids...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (bids.length === 0) return <p className="text-gray-500">No bids received yet.</p>;

  return (
    <div className="space-y-6">
      {bids
        .filter((bid) => bid.gigId)
        .map((bid) => (
          <div
            key={bid._id}
            className="bg-white p-6 rounded-lg shadow-md border hover:border-blue-500 transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Gig: <span className="text-blue-600">{bid.gigId?.title || "Untitled Gig"}</span>
            </h3>

            <p className="mt-2 text-sm text-gray-700">
              <strong>Proposal:</strong> {bid.proposal}
            </p>

            <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
              <span>
                Freelancer: <strong>{bid.freelancerId.username}</strong> (
                {bid.freelancerId.email})
              </span>
              <span className="text-green-600 font-semibold">
                ₹
                {typeof bid.bidAmount === "number"
                  ? bid.bidAmount.toLocaleString()
                  : "N/A"}
              </span>
            </div>

            {bid.status === "accepted" ? (
              <div className="mt-4 flex items-center gap-4">
                <p className="text-sm text-green-600 font-medium">✅ Bid Accepted</p>
                {onChatClick && (
                  <button
                    onClick={() => onChatClick(bid.freelancerId._id)}
                    className="flex items-center text-sm text-blue-500 hover:underline"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat
                  </button>
                )}
              </div>
            ) : bid.status === "rejected" ? (
              <p className="mt-4 text-sm text-red-500 italic">❌ Bid Rejected</p>
            ) : (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleBidAction(bid._id, "accepted")}
                  className="text-sm px-3 py-1 bg-green-500 text-white rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleBidAction(bid._id, "rejected")}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
