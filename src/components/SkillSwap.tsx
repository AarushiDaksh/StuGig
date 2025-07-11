"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import SwipeCard from "./SwipeCard";
import { SwapProfile } from "@/types/skillswap";

export default function SkillSwapPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [profiles, setProfiles] = useState<SwapProfile[]>([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/skillswap/profiles?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profiles.length > 0) {
          setProfiles(data.profiles);
        }
      })
      .catch(err => console.error("Error fetching profiles:", err));
  }, [userId]);

  const swipe = async (toUser: string, direction: string) => {
    if (!userId) return;

    await fetch("/api/skillswap/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUser: userId, toUser, direction }),
    });

    setProfiles(prev => prev.filter(p => p.userId !== toUser));
  };

  const dummyProfile: SwapProfile = {
    userId: "dummy",
    name: "This is dummy user",
    avatar: "https://cdn-icons-png.flaticon.com/128/11498/11498793.png",
    description: "I'm a logo designer looking for a frontend dev to build my site!",
    offeredSkill: "🎨 Logo Design",
    requiredSkill: "💻 Web Development",
  };

  return (
    <div
      className="min-h-screen w-full  bg-center py-12 px-4"
      style={{ backgroundImage: "url('/hi.jpeg')" }}
    >
      <div className="max-w-xl mx-auto space-y-6 rounded-2xl p-6 shadow-xl border border-white/20 bg-white/30 backdrop-blur-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-[#FFADFF] drop-shadow">
            🔥 SkillSwap
          </h2>
          <p className="text-sm text-[#cb3853]/90">
            When Freelancers complete building their profile it will be shown here
          </p>
          <p className="text-sm text-[#cb3853]">
            Swipe right to match with other freelancers
          </p>
        </div>

        {/* Uncomment this to show the cards */}
        {/* {profiles.length > 0 ? (
          <SwipeCard
            profile={profiles[0]}
            onSwipeLeft={() => swipe(profiles[0].userId, "left")}
            onSwipeRight={() => swipe(profiles[0].userId, "right")}
          />
        ) : (
          <SwipeCard profile={dummyProfile} onSwipeLeft={() => {}} onSwipeRight={() => {}} />
        )} */}
      </div>
    </div>
  );
}
