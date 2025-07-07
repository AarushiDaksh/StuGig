"use client";
import { useEffect, useState } from "react";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
}

export default function ClientJobList() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch("/api/client/gigs");
        const data = await res.json();
        setGigs(data.gigs || []);
      } catch (error) {
        console.error("❌ Failed to fetch gigs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading gigs...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Posted Gigs</h2>
      {gigs.length === 0 ? (
        <p className="text-gray-500">You haven’t posted any gigs yet.</p>
      ) : (
        gigs.map((gig) => (
          <div
            key={gig._id}
            className="bg-white p-4 rounded-md shadow-sm border"
          >
            <h3 className="text-lg font-bold">{gig.title}</h3>
            <p className="text-gray-700">{gig.description}</p>
            <p className="text-blue-600 font-medium mt-2">₹{gig.budget}</p>
            <p className="text-sm text-gray-400 mt-1">
              Posted on {new Date(gig.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
