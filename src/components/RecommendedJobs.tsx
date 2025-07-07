"use client";

import { useEffect, useState } from "react";

export default function RecommendedJobs({ freelancerId }: { freelancerId: string }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch("/api/match/freelancer", {
        method: "POST",
        body: JSON.stringify({ freelancerId }),
      });
      const data = await res.json();
      if (data.success) setJobs(data.recommendations);
    };
    fetchRecommendations();
  }, [freelancerId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">🔮 AI-Recommended Jobs</h2>
      {jobs.length === 0 ? (
        <p>No personalized recommendations yet.</p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((rec: any, index: number) => (
            <li key={index} className="border p-4 rounded-md">
              <h3 className="font-semibold text-lg">{rec.job.title}</h3>
              <p className="text-gray-600">{rec.job.description}</p>
              <p className="text-sm text-green-600">Match Score: {rec.score.toFixed(1)}%</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
