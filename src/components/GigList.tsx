"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
  clientId: string;
  applied: boolean;
}

export default function GigList({ freelancerId }: { freelancerId: string }) {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "applied">("all");

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await fetch(`/api/gigs/all?freelancerId=${freelancerId}`);
        const data = await res.json();
        setGigs(data.gigs || []);
      } catch (error) {
        console.error("Failed to fetch gigs:", error);
      }
    };

    fetchGigs();
  }, [freelancerId]);

  const handleApply = async (gig: Gig) => {
    try {
      // Step 1: Apply for gig
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId: gig._id,
          clientId: gig.clientId,
          freelancerId,
          amount: gig.budget,
          proposal: "Interested in this gig!",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Error: " + data.error);
        return;
      }

      // Update UI
      setGigs((prev) => prev.map((g) => (g._id === gig._id ? { ...g, applied: true } : g)));
      alert("Applied successfully!");

      // Step 2: Create conversation
      const convRes = await fetch("/api/chat/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: gig.clientId,
          freelancerId,
        }),
      });

      const convData = await convRes.json();
      const conversationId = convData.conversation?._id;

      if (!conversationId) {
        console.error("Conversation creation failed");
        return;
      }

      // Step 3: Send initial message
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          sender: freelancerId,
          text: `Hi, I've applied for your gig "${gig.title}". Looking forward to working with you!`,
        }),
      });

    } catch (err) {
      console.error("Apply Error:", err);
      alert("Failed to apply for gig");
    }
  };

  const filteredGigs = gigs.filter((gig) => (activeTab === "applied" ? gig.applied : true));

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded ${activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          All Gigs
        </button>
        <button
          onClick={() => setActiveTab("applied")}
          className={`px-4 py-2 rounded ${activeTab === "applied" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Applied Gigs
        </button>
      </div>

      {filteredGigs.length === 0 ? (
        <p className="text-gray-500">No gigs to show.</p>
      ) : (
        filteredGigs.map((gig) => (
          <div key={gig._id} className="p-4 bg-white shadow rounded border space-y-2">
            <h2 className="font-bold text-lg">{gig.title}</h2>
            <p className="text-sm text-gray-500">{gig.description}</p>
            <p className="text-sm text-gray-700">
              Budget: ₱{gig.budget} | Posted on: {new Date(gig.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              {!gig.applied && (
                <button
                  onClick={() => handleApply(gig)}
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Apply
                </button>
              )}
              {gig.applied && (
                <span className="px-4 py-1 text-sm bg-green-100 text-green-600 rounded">Applied</span>
              )}
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-black">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
