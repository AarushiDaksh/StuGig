"use client";
import { useEffect, useState } from "react";

interface Application {
  freelancerId: {
    username: string;
    email: string;
  };
  coverLetter: string;
  status: string;
}

export default function ApplicationsList({ gigId }: { gigId: string }) {
  const [apps, setApps] = useState<Application[]>([]);

useEffect(() => {
  const fetchApplications = async () => {
    const res = await fetch(`/api/gigs/applications/${gigId}`);
    const data = await res.json();
    setApps(data.applications || []);
  };

  fetchApplications();
}, [gigId]);


  return (
    <div className="space-y-4 mt-4">
      {apps.map((app, idx) => (
        <div key={idx} className="border p-4 rounded bg-gray-50">
          <p className="font-bold">{app.freelancerId.username}</p>
          <p className="text-sm text-gray-600">{app.freelancerId.email}</p>
          <p className="mt-2">{app.coverLetter}</p>
          <p className="text-sm mt-1 text-blue-600">Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
}