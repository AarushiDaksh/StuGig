"use client";

export function SuggestionsCard() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Add to your feed</h4>
      <div className="mt-3 space-y-3">
        {["Next.js", "React Native", "MongoDB"].map((t) => (
          <div key={t} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Topic</p>
              </div>
            </div>
            <button className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
              + Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
