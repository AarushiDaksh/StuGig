"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "@/store";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        {/* Only wrap body content with ThemeProvider */}
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          {children}
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}
