import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/client-wrapper"; // wrapper component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: "StuGig | The Smart Freelance Marketplace for Students",
  description:
    "StuGig is a student-first freelance platform for gigs like resume writing, design, assignment help, and more. Post jobs, bid on tasks, and earn securely with AI-powered match suggestions.",
  keywords: [
    "StuGig",
    "Student Freelance",
    "Freelancer Jobs",
    "Campus Gigs",
    "AI Job Matchmaker",
    "Assignment Help",
    "Student Jobs Platform",
  ],
  authors: [{ name: "StuGig Team" }],
  creator: "StuGig",
  publisher: "StuGig",
  metadataBase: new URL("https://stugig.io"),
  openGraph: {
    type: "website",
    title: "StuGig | Student Freelance Platform",
    description:
      "StuGig connects student freelancers and clients through smart bidding, secure payments, real-time messaging, and AI recommendations.",
    siteName: "StuGig",
    images: [
      {
        url: "/images/stugig-og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "StuGig - Student Freelance Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StuGig | Freelance Smarter, Earn Better",
    description:
      "Secure student freelance gigs with live chat, reviews, Stripe payments & AI-powered job matches.",
    images: ["/images/stugig-twitter-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
