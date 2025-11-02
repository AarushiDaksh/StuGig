import Image from "next/image";
import Link from "next/link";

export function MiniProfileCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header gradient */}
      <div className="h-14 w-full bg-gradient-to-r from-sky-500/30 to-blue-500/30" />

      <div className="-mt-8 px-4 pb-4">
        {/* Profile Image */}
        <div className="h-16 w-16 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden">
          <Image
            src="/h.jpg" 
            alt="Aarushi Daksh"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Aarushi Daksh
        </h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Full-Stack Developer • MERN | Next.js | RN
        </p>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-zinc-50 p-2 text-xs dark:bg-zinc-950/40">
          <div className="flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Connections</span>
            <span className="font-semibold text-sky-600">480</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Views</span>
            <span className="font-semibold text-sky-600">1.2k</span>
          </div>
        </div>

        {/* Button */}
        <Link
          href="/profile"
          className="mt-3 inline-block w-full rounded-md border border-zinc-200 px-3 py-1.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          View profile
        </Link>
      </div>
    </div>
  );
}
