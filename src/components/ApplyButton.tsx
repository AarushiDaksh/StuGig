// components/ApplyButton.tsx
"use client";

import { useState } from "react";

export default function ApplyButton({ gigId }: { gigId: string }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const applyToGig = async () => {
    const res = await fetch(`/api/gigs/apply/${gigId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverLetter }),
    });

    const data = await res.json();
    if (res.ok) {
      setSubmitted(true);
      alert("Applied successfully!");
    } else {
      alert(data.error);
    }
  };

  if (submitted) return <p className="text-green-500">Application sent!</p>;

  return (
    <div className="space-y-2">
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Write your cover letter..."
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
      />
      <button
        onClick={applyToGig}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply to Gig
      </button>
    </div>
  );
}
