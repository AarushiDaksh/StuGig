"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store"; 

export default function GigUploadForm() {
  const freelancerId = useSelector(
    (state: RootState) => state.user.currentUser?.id
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freelancerId) {
      alert("Freelancer ID missing. Please re-login.");
      return;
    }

    const payload = {
      ...form,
      budget: Number(form.budget),
      freelancerId,
    };

    console.log("📤 Submitting:", payload);

    const res = await fetch("/api/gigs/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Gig uploaded!");
      setForm({ title: "", description: "", budget: "" });
    } else {
      alert("❌ Error: " + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full p-2 rounded border border-gray-300"
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full p-2 rounded border border-gray-300"
        required
      />
      <input
        type="number"
        placeholder="Budget"
        value={form.budget}
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
        className="w-full p-2 rounded border border-gray-300"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Upload Gig
      </button>
    </form>
  );
}
