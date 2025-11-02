import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientWrapper from "@/components/ClientWarapper";


export const metadata: Metadata = {
  title: "Rolio | Your Professional Network",
  description: "Connect, share, hire — the Rolio way.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server Component (no "use client"!)
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
