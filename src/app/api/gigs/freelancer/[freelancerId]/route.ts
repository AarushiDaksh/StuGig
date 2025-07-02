import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function GET(req: NextRequest) {
  await connect();

  const url = new URL(req.url);
  const freelancerId = url.searchParams.get("freelancerId");

  if (!freelancerId) {
    return NextResponse.json({ error: "Missing freelancerId" }, { status: 400 });
  }

  try {
    const gigs = await Gig.find({ "freelancerId._id": freelancerId });
    return NextResponse.json({ gigs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch gigs", error },
      { status: 500 }
    );
  }
}
