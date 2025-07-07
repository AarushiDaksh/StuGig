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

export default function AppliedGigList() {
  const [gigs, setGigs] = useState<Gig[]>([]);

  useEffect(() => {
    const fetchAppliedGigs = async () => {
      try {
        const res = await fetch("/api/gigs/applied");
        const data = await res.json();
        setGigs(data.appliedGigs || []);
      } catch (error) {
        console.error("Failed to fetch applied gigs:", error);
      }
    };

    fetchAppliedGigs();
  }, []);

  if (!gigs.length) {
    return <p className="text-gray-500">You haven’t applied to any gigs yet.</p>;
  }

  return (
    <div className="space-y-6 mt-10">
      <h2 className="text-xl font-semibold">🎯 Gigs You’ve Applied To</h2>
      {gigs.map((gig) => (
        <div
          key={gig._id}
          className="p-4 bg-gray-50 shadow rounded border border-blue-100 space-y-2"
        >
          <p className="text-sm text-gray-400">
            Applied on: {new Date(gig.createdAt).toLocaleDateString()}
          </p>
          <h2 className="font-bold text-lg text-blue-800">{gig.title}</h2>
          <p className="text-sm text-gray-600">{gig.description}</p>
          <p className="text-sm text-gray-700">
            Budget: ₱{gig.budget} | Deadline: {gig.deadline ? new Date(gig.deadline).toLocaleDateString() : "N/A"}
          </p>
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
            <Share2 size={16} /> Share
          </button>
        </div>
      ))}
    </div>
  );
}
