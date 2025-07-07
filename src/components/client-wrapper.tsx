"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "@/store";
// import { SocketProvider } from "@/lib/socket"; // Make sure path is correct

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        {/* <SocketProvider> */}
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            {children}
          </ThemeProvider>
        {/* </SocketProvider> */}
      </SessionProvider>
    </ReduxProvider>
  );
}
