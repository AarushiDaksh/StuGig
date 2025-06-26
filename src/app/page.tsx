"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/HeroSection/Hero";
import Explore from "@/components/HowItWorks/HowItWorks";
import { PopularServices } from "@/components/Services/PopularServices";
import ContactUs from "@/components/ContactUs";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import SectionSpacer from "@/components/SectionSpacer";
import { ChatbotWidget } from "@/components/Chatbot/ChatbotWidget";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          title="StuGig – Freelance Marketplace for Students"
          headline="Bid Smart. Work Smart. Grow Smart."
          subheading="Join StuGig to find freelance gigs, post student projects, and get AI-matched to the perfect opportunity in your campus economy."
          ctaText="Find Talent"
          ctaSecondaryText="Become a Freelancer"
          ctaHref="/jobs"
          secondaryCtaHref="/signup"
        />

        {/* Explore Section */}
        <SectionSpacer>
          <MaxWidthWrapper>
            <div id="explore">
              <Explore />
            </div>
          </MaxWidthWrapper>
        </SectionSpacer>

        {/* Popular Services */}
        <SectionSpacer size="none">
          <MaxWidthWrapper>
            <div id="features">
              <PopularServices />
            </div>
          </MaxWidthWrapper>
        </SectionSpacer>

        {/* Contact Section */}
        <SectionSpacer only="bottom">
          <MaxWidthWrapper>
            <div id="contact">
              <ContactUs />
            </div>
          </MaxWidthWrapper>
        </SectionSpacer>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 px-4 md:px-6 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2 font-bold mb-4 md:mb-0">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              S
            </div>
            <span>StuGig</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 StuGig. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
