"use client";

import { useState } from "react";

export function ComposerCard() {
  const [text, setText] = useState("");

  const handlePost = () => {
    // 🔹 Add API call or callback to parent here if needed
    setText("");
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="h-10 w-10 shrink-0 rounded-full bg-blue-200" />

        {/* Input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start a post..."
          className="flex-1 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900 placeholder:text-blue-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
        />

        {/* Post button */}
        <button
          disabled={!text.trim()}
          onClick={handlePost}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          Post
        </button>
      </div>

      {/* Action shortcuts */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-blue-700">
        <span className="rounded-md px-2 py-1 hover:bg-blue-50 cursor-pointer">📷 Photo</span>
        <span className="rounded-md px-2 py-1 hover:bg-blue-50 cursor-pointer">🎥 Video</span>
        <span className="rounded-md px-2 py-1 hover:bg-blue-50 cursor-pointer">💼 Job</span>
      </div>
    </div>
  );
}
