"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
  clientName: string;
  applied: boolean;
  deadline: string;
}

export default function GigList() {
  const [gigs, setGigs] = useState<Gig[]>([]);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch("/api/gigs/all");
        const data = await res.json();
        setGigs(data.gigs || []);
      } catch (error) {
        console.error("Failed to fetch gigs:", error);
      }
    };

    fetchGigs();
  }, []);

  const handleApply = async (gigId: string) => {
    try {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId,
          amount: 0,
          proposal: "Interested in this gig!",
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert("Applied successfully!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to apply for gig");
    }
  };

  return (
    <div className="space-y-6">
      {gigs.map((gig) => (
        <div key={gig._id} className="p-4 bg-white shadow rounded border space-y-2">
          <h2 className="font-bold text-lg">{gig.title}</h2>
          <p className="text-sm text-gray-500">{gig.description}</p>
          <p className="text-sm text-gray-700">
            Budget: ₱{gig.budget} | Posted on: {new Date(gig.createdAt).toLocaleDateString()}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleApply(gig._id)}
              className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Apply
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
