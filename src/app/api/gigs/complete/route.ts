import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function PUT(req: NextRequest) {
  await connect();

  const { gigId, freelancerId } = await req.json();

  if (!gigId || !freelancerId) {
    return NextResponse.json({ success: false, error: "Missing gigId or freelancerId" }, { status: 400 });
  }

  try {
    const updated = await Gig.findByIdAndUpdate(
      gigId,
      {
        isCompleted: true,
        freelancerId, 
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, gig: updated });
  } catch (err) {
    console.error("DB update failed:", err);
    return NextResponse.json({ success: false, error: "DB error" }, { status: 500 });
  }
}
