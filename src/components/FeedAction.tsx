"use client";

import React from "react";

export function FeedAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-md py-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 w-full"
    >
      {icon}
      <span className="text-xs sm:text-sm">{label}</span>
    </button>
  );
}
