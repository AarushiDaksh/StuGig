import Link from "next/link";

export function ShortcutsCard() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Shortcuts</h4>
      <ul className="mt-3 space-y-2 text-sm">
        <li>
          <Link href="/network" className="text-sky-700 hover:underline dark:text-sky-400">
            Grow your network
          </Link>
        </li>
        <li>
          <Link href="/jobs" className="text-sky-700 hover:underline dark:text-sky-400">
            See job alerts
          </Link>
        </li>
        <li>
          <Link href="/posts" className="text-sky-700 hover:underline dark:text-sky-400">
            Write a post
          </Link>
        </li>
      </ul>
    </div>
  );
}
