"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const services = [
  {
    title: "Logo Design",
    image: "https://cdn-icons-png.flaticon.com/128/3437/3437294.png",
  },
  {
    title: "Assignment Help",
    image: "https://cdn-icons-png.flaticon.com/128/14019/14019093.png",
  },
  {
    title: "Resume Writing",
    image: "https://cdn-icons-png.flaticon.com/128/6186/6186195.png",
  },
  {
    title: "Presentation Design",
    image: "https://cdn-icons-png.flaticon.com/128/1436/1436664.png",
  },
  {
    title: "Portfolio Reviews",
    image: "https://cdn-icons-png.flaticon.com/128/3476/3476457.png",
  },
  {
    title: "Mock Interviews",
    image: "https://cdn-icons-png.flaticon.com/128/3135/3135682.png",
  },
];

export function PopularServices() {
  const router = useRouter();

  return (
    <section className="py-12 px-4 md:px-8 bg-background">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Popular Services
        </h2>
        <p className="text-muted-foreground text-lg">
          Get help on what matters most in your student journey.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="animate-slide flex gap-6 min-w-max px-2">
          {[...services, ...services].map((service, index) => (
            <div
              key={index}
              className="min-w-[200px] sm:min-w-[240px] rounded-xl p-4 bg-gradient-to-br from-green-100 to-green-50 dark:from-[#1c1c1c] dark:to-[#2a2a2a] shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-center text-lg font-semibold text-foreground">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* // jobs */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => router.push("/jobs")}
          className="px-6 py-2 rounded-md border text-black border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black font-medium transition"
        >
          Explore Jobs
        </button>
        </div>

    </section>
  );
}
