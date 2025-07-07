import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utlis/db";
import UserFreelancer from "@/models/UserFreelancer";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "freelancer") {
      return NextResponse.json(
        { error: "Unauthorized - Freelancer access required" },
        { status: 401 }
      );
    }

    const freelancer = await UserFreelancer.findById(session.user.id).select(
      "isProfileComplete firstName lastName skills hourlyRate availability"
    );

    if (!freelancer) {
      return NextResponse.json(
        { error: "Freelancer not found" },
        { status: 404 }
      );
    }

    // Check profile completion manually
    const isComplete =
      !!freelancer.firstName?.trim() &&
      !!freelancer.lastName?.trim() &&
      Array.isArray(freelancer.skills) &&
      freelancer.skills.length > 0 &&
      typeof freelancer.hourlyRate === "number" &&
      freelancer.hourlyRate > 0;

    return NextResponse.json(
      {
        isProfileComplete: isComplete,
        profile: freelancer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking profile status:", error);
    return NextResponse.json(
      { error: "Failed to check profile status" },
      { status: 500 }
    );
  }
}
