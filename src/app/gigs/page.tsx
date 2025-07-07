"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Share2 } from "lucide-react";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
  clientName: string;
  applied: boolean;
  deadline: string;
  images?: string[];
}

export default function GigListPage() {
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

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <section className="max-w-4xl mx-auto space-y-6">
        {gigs.length === 0 ? (
          <p className="text-gray-500 text-center">No gigs available at the moment.</p>
        ) : (
          gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white shadow-sm rounded-xl p-6 border space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{gig.clientName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(gig.createdAt).toLocaleDateString()} at{" "}
                    {new Date(gig.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className="text-xs font-medium bg-green-100 text-green-600 px-3 py-1 rounded-full">
                  AVAILABLE
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold">{gig.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{gig.description}</p>
              </div>

              {gig.images && gig.images.length > 0 && (
                <div className="flex gap-3 mt-2">
                  {gig.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Gig image"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-500 mt-2">
                <p>
                  <strong>Budget:</strong> ₱{gig.budget.toLocaleString()}
                </p>
                <p>
                  <strong>Deadline:</strong> {new Date(gig.deadline).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-1 rounded border text-gray-500 text-sm"
                  disabled
                >
                  {gig.applied ? "Already applied" : "Apply"}
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
                  <MessageSquare size={16} /> Message
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
