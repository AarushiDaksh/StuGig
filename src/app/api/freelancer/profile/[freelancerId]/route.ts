import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import UserFreelancer from "@/models/UserFreelancer";

// GET - Fetch freelancer profile by ID (public endpoint)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ freelancerId: string }> }
) {
  try {
    await connect();

    const { freelancerId } = await params;

    if (!freelancerId) {
      return NextResponse.json(
        { error: "Freelancer ID is required" },
        { status: 400 }
      );
    }

    const freelancer = await UserFreelancer.findById(freelancerId).select(
      "-password -email"
    );

    if (!freelancer) {
      return NextResponse.json(
        { error: "Freelancer not found" },
        { status: 404 }
      );
    }

    // Only return profile if it's complete
    if (!freelancer.isProfileComplete) {
      return NextResponse.json(
        { error: "Profile not available" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: freelancer }, { status: 200 });
  } catch (error) {
    console.error("Error fetching freelancer profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
