import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import UserFreelancer from "@/models/UserFreelancer";

export async function GET(req: NextRequest) {
  await connect();

  const freelancerId = req.nextUrl.searchParams.get("id");
  if (!freelancerId) {
    return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
  }

  try {
    const profile = await UserFreelancer.findById(freelancerId);
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    const isProfileComplete = profile.skills?.length > 0 && profile.hourlyRate;

    return NextResponse.json({
      success: true,
      isProfileComplete,
      profile,
    });
  } catch (err) {
    console.error("Status fetch error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
