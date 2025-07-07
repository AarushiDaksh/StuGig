"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

const allJobs: Job[] = [
  {
    id: "1",
    title: "Logo Design for Student Club",
    description: "Need a creative logo for our new student club.",
    price: 25000,
    category: "Design",
  },
  {
    id: "2",
    title: "Assignment Help - Python",
    description: "Looking for someone to assist with a Python assignment.",
    price: 15000,
    category: "Education",
  },
  {
    id: "3",
    title: "Resume Writing",
    description: "Help me build a standout resume.",
    price: 10000,
    category: "Writing",
  },
  {
    id: "4",
    title: "Presentation Design",
    description: "Design a PowerPoint for a startup pitch.",
    price: 18000,
    category: "Design",
  },
  {
    id: "5",
    title: "Mock Interview (Technical)",
    description: "Conduct a mock interview for my upcoming placement.",
    price: 300000,
    category: "Career",
  },
];

export default function JobsPage() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");
  const router = useRouter();

  const categories = ["All", ...new Set(allJobs.map((job) => job.category))];

  const filteredJobs = allJobs
    .filter((job) => categoryFilter === "All" || job.category === categoryFilter)
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <main className="min-h-screen p-10 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Browse Jobs</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-64"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-64"
        >
          <option value="none">Sort by Price</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{job.description}</p>
            <p className="text-sm text-gray-500 mb-1">Category: {job.category}</p>
            <p className="text-green-600 font-bold mb-3">₹{job.price}</p>
            <button
              onClick={() => router.push("/login/freelancer")}
              className="mt-auto px-4 py-2 bg-black text-white rounded transition"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
