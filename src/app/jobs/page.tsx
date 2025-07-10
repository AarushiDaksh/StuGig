"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, Briefcase, Filter, ArrowDownUp } from "lucide-react";

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
    <main className="min-h-screen px-6 md:px-12 py-10 bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900">
      <h2 className="text-2xl font-extrabold text-center mb-8">🎯Find Your Next Gig</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-12 items-center">
        <div className="flex items-center gap-2 w-full md:w-64">
          <Filter size={18} className="text-gray-600" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-64">
          <ArrowDownUp size={18} className="text-gray-600" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="none">Sort by Price</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredJobs.map((job) => (
          <motion.div
            key={job.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl p-6 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="text-black" size={20} />
              <h2 className="text-xl font-bold">{job.title}</h2>
            </div>
            <p className="text-gray-700 mb-3">{job.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 font-medium rounded-full">
                  {job.category}
                </span>
              </span>
              <span className="text-green-700 font-semibold text-lg">
                ₹{job.price.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => router.push("/login/freelancer")}
              className="w-full py-2 px-4 bg-gradient-to-r from-black to-gray-900 text-white rounded-xl font-medium hover:opacity-90 transition"
            >
              Apply Now
            </button>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
