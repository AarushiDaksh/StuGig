"use client";

import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";

const navItems = [
  {
    name: "Explore",
    link: "#explore",
  },
  {
    name: "Services",
    link: "#features",
  },
  {
    name: "Connect",
    link: "#contact",
  },
];

export const Header = () => {
  return (
    <FloatingNav
      navItems={navItems}
      className="py-2 px-4"
      showLogo={true}
      showThemeToggle={true}
    />
  );
};
