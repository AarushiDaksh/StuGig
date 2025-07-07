"use client";

import { useEffect, useState } from "react";

interface Bid {
  _id: string;
  bidAmount: number;
  proposal: string;
  freelancerId: {
    _id: string;
    username: string;
    email: string;
  };
  gigId: {
    _id: string;
    title: string;
  } | null; // handle possibly deleted gigs
}

export default function ClientBidsPanel() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch("/api/client/bids");
        const data = await res.json();
        setBids(data.bids || []);
      } catch (err) {
        console.error("Failed to load bids:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  if (loading) return <p className="text-gray-500">Loading bids...</p>;

  if (bids.length === 0) {
    return <p className="text-gray-500">No bids received yet.</p>;
  }

  return (
    <div className="space-y-4">
      {bids
        .filter((bid) => bid.gigId) // skip bids with null gigs
        .map((bid) => (
          <div
            key={bid._id}
            className="bg-white p-4 rounded shadow border border-gray-200"
          >
            <h3 className="text-md font-semibold">
              Bid on: <span className="text-blue-600">{bid.gigId?.title}</span>
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              Proposal: {bid.proposal}
            </p>
            <div className="mt-2 text-sm text-gray-500 flex justify-between">
              <span>
                Freelancer: {bid.freelancerId.username} (
                {bid.freelancerId.email})
              </span>
              <span className="text-green-600 font-medium">
                ₹{bid.bidAmount}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
