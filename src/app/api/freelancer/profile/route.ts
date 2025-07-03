import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utlis/db";
import UserFreelancer from "@/models/UserFreelancer";
import { authOptions } from "@/lib/authOptions";

// GET - Fetch freelancer profile
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
      "-password"
    );

    if (!freelancer) {
      return NextResponse.json(
        { error: "Freelancer not found" },
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

// PUT - Update freelancer profile
export async function PUT(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "freelancer") {
      return NextResponse.json(
        { error: "Unauthorized - Freelancer access required" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "skills"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if profile is complete
    const isProfileComplete = !!(
      body.firstName &&
      body.lastName &&
      body.skills &&
      body.skills.length > 0 &&
      body.hourlyRate &&
      body.hourlyRate > 0
    );

    const updatedProfile = await UserFreelancer.findByIdAndUpdate(
      session.user.id,
      {
        ...body,
        isProfileComplete,
        username: `${body.firstName} ${body.lastName}`, // Update username to full name
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        profile: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating freelancer profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}