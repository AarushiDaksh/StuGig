"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Home,
  Users2,
  BriefcaseBusiness,
  MessageSquare,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useState } from "react";

export function TopNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname() || ""; // fix: avoid TS “possibly null”
  const [open, setOpen] = useState(false);

  const isAuth = status === "authenticated";
  const image = (session?.user?.image as string | undefined) || "";

  const tab =
    "group flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-md text-[11px] md:text-xs text-blue-700/80 hover:bg-blue-50 hover:text-blue-700 transition";
  const active = "bg-blue-50 text-blue-700 font-semibold";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href) ? active : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
            R
          </div>
          <span className="hidden sm:inline text-lg font-semibold text-blue-800">
            Rolio
          </span>
        </Link>

        {/* Search (desktop) */}
        <div className="relative ml-1 hidden flex-1 items-center sm:flex">
          <input
            type="text"
            placeholder="Search for people, jobs, posts…"
            className="w-full rounded-md border border-blue-200 bg-blue-50/60 px-3 py-2 text-sm text-blue-900 placeholder-blue-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Tabs */}
        <nav className="ml-auto grid grid-cols-5 gap-1 rounded-md">
          <Link href="/" className={`${tab} ${isActive("/")}`} aria-label="Home" title="Home">
            <Home className="h-5 w-5" />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link
            href="/network"
            className={`${tab} ${isActive("/network")}`}
            aria-label="My Network"
            title="My Network"
          >
            <Users2 className="h-5 w-5" />
            <span className="hidden md:inline">Network</span>
          </Link>
          <Link
            href="/jobs"
            className={`${tab} ${isActive("/jobs")}`}
            aria-label="Jobs"
            title="Jobs"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            <span className="hidden md:inline">Jobs</span>
          </Link>
          <Link
            href="/messaging"
            className={`${tab} ${isActive("/messaging")}`}
            aria-label="Messaging"
            title="Messaging"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="hidden md:inline">Messaging</span>
          </Link>
          <Link
            href="/notifications"
            className={`${tab} ${isActive("/notifications")}`}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="hidden md:inline">Alerts</span>
          </Link>
        </nav>

        {/* Profile / Auth */}
        <div className="relative">
          {isAuth ? (
            <button
              onClick={() => setOpen((s) => !s)}
              className="ml-2 flex items-center gap-2 rounded-md border border-blue-100 bg-white px-2 py-1 text-sm text-blue-800 hover:bg-blue-50"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {image ? (
                <Image
                  src={image}
                  alt="Profile"
                  width={28}
                  height={28}
                  className="rounded-full border border-blue-100"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                  R
                </div>
              )}
              <span className="hidden sm:inline max-w-[120px] truncate">
                {session?.user?.name ?? "User"}
              </span>
              <ChevronDown className="h-4 w-4 text-blue-700/80" />
            </button>
          ) : (
            <Link
              href="/login/User"
              className="ml-2 rounded-md border border-blue-200 bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign in
            </Link>
          )}

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-blue-100 bg-white shadow-lg"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-blue-900">{session?.user?.name ?? "User"}</p>
                <p className="truncate text-xs text-blue-700/70">{session?.user?.email ?? ""}</p>
              </div>
              <div className="border-t border-blue-100" />
              <Link
                href="/profile"
                className="block px-3 py-2 text-sm text-blue-800 hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                View Profile
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-sm text-blue-800 hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                Settings & Privacy
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/login/User" });
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search (under header) */}
      <div className="sm:hidden border-t border-blue-100 bg-white/90">
        <div className="mx-auto max-w-6xl px-3 py-2">
          <input
            type="text"
            placeholder="Search Rolio"
            className="w-full rounded-md border border-blue-200 bg-blue-50/60 px-3 py-2 text-sm text-blue-900 placeholder-blue-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </header>
  );
}

export default TopNav;
