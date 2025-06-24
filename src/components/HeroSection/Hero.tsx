"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  headline?: string;
  subheading?: string;
  ctaText?: string;
  ctaSecondaryText?: string;
  ctaHref?: string;
  secondaryCtaHref?: string;
}

const RetroGrid = () => {
  return (
    <div className="pointer-events-none absolute size-full overflow-hidden [perspective:200px] opacity-50">
      <div className="absolute inset-0 [transform:rotateX(65deg)]">
        <div className="animate-grid [background-image:linear-gradient(to_right,gray_1px,transparent_0),linear-gradient(to_bottom,gray_1px,transparent_0)] [background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-200%] [transform-origin:100%_0_0] [width:600vw] dark:[background-image:linear-gradient(to_right,gray_1px,transparent_0),linear-gradient(to_bottom,gray_1px,transparent_0)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  );
};

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      className,
      title = "StuGig – Freelance Smarter",
      headline = "Bid Smarter. Work Faster. Grow as a Student.",
      subheading = "StuGig helps students earn with freelance gigs — powered by AI job matching, secure payments, real-time chat, and a peer-reviewed reputation system.",
      ctaText = "Be a Client",
      ctaSecondaryText = "or Freelancer",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative min-h-screen", className)} ref={ref} {...props}>
        <div className="absolute top-0 z-[0] h-screen w-full bg-blue-950/10 dark:bg-blue-950/10 " />
        <section className="relative max-w-full mx-auto z-1 min-h-screen flex items-center">
          <RetroGrid />

          <div className="max-w-screen-xl z-10 mx-auto px-4 py-20 md:px-8 w-full">
            <div className="space-y-5 max-w-3xl leading-0 lg:leading-5 mx-auto text-center">
              <h2 className="text-4xl tracking-tighter font-bold bg-clip-text text-transparent mx-auto md:text-6xl bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
                {headline.split(" ").map((word, i, arr) =>
                  i >= arr.length - 2 ? (
                    <span
                      key={i}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-purple-300 dark:to-blue-200"
                    >
                      {word}{" "}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </h2>

              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-base leading-relaxed px-4">
                {subheading}
              </p>

              <h1 className="text-sm text-gray-600 dark:text-gray-400 group font-medium mx-auto px-5 py-2 bg-gradient-to-tr from-zinc-300/20 via-purple-400/20 to-transparent dark:from-zinc-300/5 dark:via-purple-400/5 border-[2px] border-black/5 dark:border-white/5 rounded-3xl w-fit">
                {title}
                <ChevronRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
              </h1>

              <div className="items-center justify-center gap-x-4 space-y-3 sm:flex sm:space-y-0 pt-8">
                <Button size="lg" className="px-8 w-full sm:w-auto" asChild>
                  <Link href="/client-login">{ctaText}</Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto mt-4 sm:mt-0" asChild>
                  <Link href="/freelancer-login">{ctaSecondaryText}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);

Hero.displayName = "Hero";
export { Hero };
