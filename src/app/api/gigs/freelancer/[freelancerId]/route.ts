import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function GET(
  req: NextRequest,
  { params }: { params: { freelancerId: string } }
) {
  await connect();

  const { freelancerId } = params;

  if (!freelancerId) {
    return NextResponse.json(
      { success: false, error: "Freelancer ID is required" },
      { status: 400 }
    );
  }

  try {
    const gigs = await Gig.find({ freelancerId }); // Only gigs linked to this freelancer
    return NextResponse.json({ success: true, gigs }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch gigs" },
      { status: 500 }
    );
  }
}
