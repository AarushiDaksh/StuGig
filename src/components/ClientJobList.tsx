"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
  isCompleted?: boolean; // Add this flag for logic (optional if handled from backend)
}

export default function ClientJobList() {
  const [jobs, setJobs] = useState<Gig[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/gigs/client");
        const data = await res.json();
        if (data.success) {
          setJobs(data.gigs);
        }
      } catch (error) {
        console.error("Error fetching client jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handlePayment = async (gig: Gig) => {
    // Placeholder for Razorpay logic
    console.log("Initiating payment for gig:", gig.title);

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gigId: gig._id, amount: gig.budget }),
    });

    const { order } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Make sure this env var is set
      amount: order.amount,
      currency: "INR",
      name: "StuGig",
      description: gig.title,
      order_id: order.id,
      handler: function (response: any) {
        console.log("Payment Success:", response);
        // You’ll later send `response` to backend to verify & store
      },
      prefill: {
        name: "Client User",
        email: "client@example.com",
      },
      theme: {
        color: "#6366F1",
      },
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
  };

  return (
    <>
      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Posted Gigs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No gigs posted yet.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="border p-4 rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.description}</p>
                <p className="text-blue-600 font-semibold mt-1">₹{job.budget}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
                </p>

                {/* Pay Now Button — shown only for completed gigs */}
                {job.isCompleted && (
                  <button
                    onClick={() => handlePayment(job)}
                    className="mt-3 inline-block bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
