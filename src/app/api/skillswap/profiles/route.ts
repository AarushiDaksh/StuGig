import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import mongoose from "mongoose";
import UserFreelancer from "@/models/UserFreelancer";
import SwapIntent from "@/models/SwapIntent";

export async function GET(req: NextRequest) {
  await connect();

  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ success: false, error: "Invalid or missing user ID" }, { status: 400 });
  }

  try {
    const swipedIds = await SwapIntent.find({ fromUser: userId }).distinct("toUser");

    const freelancers = await UserFreelancer.find({
      _id: { $ne: userId, $nin: swipedIds },
      "availability.isAvailable": true,
      isProfileComplete: true
    });

    const profiles = freelancers.map(f => ({
      userId: f._id.toString(),
      name: `${f.firstName} ${f.lastName}`,
      avatar: f.profilePicture || "/default-avatar.png",
      offeredSkill: f.skills?.[0] || "General",
      requiredSkill: f.expertise?.[0] || "Any",
      description: f.bio || "No description provided.",
      portfolioUrl: f.portfolio?.[0]?.link || "",
    }));

    return NextResponse.json({ success: true, profiles });
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
