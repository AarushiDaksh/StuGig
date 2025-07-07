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

  return (
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
