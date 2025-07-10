// src/app/api/freelancer/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function PUT(req: NextRequest) {
  await connect();

  try {
    const { gigId } = await req.json();

    if (!gigId) {
      return NextResponse.json({ success: false, error: "gigId is required" }, { status: 400 });
    }

    const updatedGig = await Gig.findByIdAndUpdate(gigId, {
      status: "completed",
      isCompleted: true,
    });

    if (!updatedGig) {
      return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, gig: updatedGig }, { status: 200 });
  } catch (error) {
    console.error("Error marking gig complete:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
