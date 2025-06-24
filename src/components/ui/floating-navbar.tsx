"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X } from "lucide-react";

export const FloatingNav = ({
  navItems,
  className,
  showLogo = true,
  showThemeToggle = true,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  showLogo?: boolean;
  showThemeToggle?: boolean;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - scrollYProgress.getPrevious()!;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      if (scrollY < windowHeight) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  // Close menu on click outside

  // Close login dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        loginDropdownOpen &&
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target as Node)
      ) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loginDropdownOpen]);

  // Close login dropdown on Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="navbar"
          initial={{ opacity: 1, y: 0 }}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex fixed top-4 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[50] px-4 py-2 items-center justify-between w-[95%] sm:max-w-2xl",
            className
          )}
        >
          {showLogo && (
            <div className="flex items-center gap-2 font-bold">
              <div className="size-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                S
              </div>
              <span className="text-sm">StuGig</span>
            </div>
          )}

          <div className="hidden md:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center justify-center space-x-5 mx-auto">
              {navItems.map((navItem, idx) => (
                <Link
                  key={`desktop-link-${idx}`}
                  href={navItem.link}
                  className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 px-2"
                >
                  {navItem.icon && <span>{navItem.icon}</span>}
                  <span className="text-sm">{navItem.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={loginDropdownRef}>
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="hidden sm:block border text-xs font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-3 py-1.5 rounded-full"
              >
                <span>Login</span>
                <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
              </button>

              {loginDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white dark:bg-black border border-neutral-200 dark:border-white/[0.2] shadow-lg rounded-xl w-56 p-3 z-50 space-y-2">
                  <button className="w-full text-sm font-medium px-4 py-2 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    Login as a Freelancer
                  </button>
                  <button className="w-full text-sm font-medium px-4 py-2 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    Login as a Client
                  </button>
                </div>
              )}
            </div>
            {showThemeToggle && <ThemeToggle />}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            key="mobile-menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
            className="fixed top-[72px] right-4 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 p-4 shadow-lg rounded-2xl w-[220px] z-[49] overflow-hidden"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="flex flex-col space-y-1.5 pt-1">
              {navItems.map((navItem, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  href={navItem.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative flex items-center space-x-2 text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50 p-2 rounded-lg transition-colors duration-150"
                >
                  {navItem.icon && (
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {navItem.icon}
                    </span>
                  )}
                  <span className="text-sm font-medium">{navItem.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
