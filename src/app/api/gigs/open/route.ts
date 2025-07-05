// GET /api/gigs/open

import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function GET(req: NextRequest) {
  await connect();

  try {
    const gigs = await Gig.find({ freelancerId: null }); // gigs not assigned
    return NextResponse.json({ success: true, gigs }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Could not fetch open gigs" },
      { status: 500 }
    );
  }
}
