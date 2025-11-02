"use client";

import Link from "next/link";

export function TrendingCard() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Trending</h4>
      <ul className="mt-3 space-y-3 text-sm">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
          <Link href="/posts/nextjs" className="hover:underline">
            Next.js 15 app routing patterns for large teams
          </Link>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
          <Link href="/posts/react-native" className="hover:underline">
            React Native performance tips for 60fps interactions
          </Link>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
          <Link href="/posts/ai-careers" className="hover:underline">
            AI roles that blend product + engineering
          </Link>
        </li>
      </ul>
    </div>
  );
}
