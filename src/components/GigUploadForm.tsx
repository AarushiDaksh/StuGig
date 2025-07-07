"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function GigUploadForm() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          budget: Number(form.budget),
          deadline: form.deadline ? new Date(form.deadline) : undefined,
          skills: form.skills.split(",").map((skill) => skill.trim()),
          clientId: session?.user?.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to create gig");

      alert("Gig created!");
      setForm({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        skills: "",
      });
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-lg font-semibold">Post a Gig</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border p-2 rounded"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border p-2 rounded"
        rows={4}
        required
      />

      <input
        type="number"
        name="budget"
        value={form.budget}
        onChange={handleChange}
        placeholder="Budget (Rs)"
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="skills"
        value={form.skills}
        onChange={handleChange}
        placeholder="Skills (comma-separated, e.g. React, Node)"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Gig"}
      </button>
    </form>
  );
}
