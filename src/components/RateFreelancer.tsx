"use client";

import { useState } from "react";

interface Props {
  clientId: string;
  freelancerId: string;
  gigId: string;
}

export default function RateFreelancer({ clientId, freelancerId, gigId }: Props) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const res = await fetch("/api/client/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, freelancerId, gigId, rating, review }),
    });
    const data = await res.json();
    if (data.success) setSubmitted(true);
  };

  if (submitted) return <p className="text-green-600">Thank you for your feedback!</p>;

  return (
    <div className="space-y-4 p-4 bg-white border rounded shadow">
      <h2 className="text-lg font-semibold">Rate Freelancer</h2>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border px-2 py-1 rounded">
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r !== 1 && "s"}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Write your review (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full border p-2 rounded"
        rows={4}
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
        Submit Review
      </button>
    </div>
  );
}
