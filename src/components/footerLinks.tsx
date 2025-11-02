"use client";

import Link from "next/link";

export function FooterLinks() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/accessibility" className="hover:underline">Accessibility</Link>
        <Link href="/help" className="hover:underline">Help Center</Link>
        <Link href="/privacy" className="hover:underline">Privacy & Terms</Link>
        <Link href="/ad-choices" className="hover:underline">Ad Choices</Link>
      </div>
      <p className="mt-3">© {new Date().getFullYear()} Rolio</p>
    </div>
  );
}
