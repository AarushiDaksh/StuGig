import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function GET(req: NextRequest) {
  await connect();

  const clientId = req.nextUrl.searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ success: false, error: "Missing clientId" }, { status: 400 });
  }

  const ongoing = await Gig.countDocuments({ clientId, isCompleted: false });
  const completed = await Gig.countDocuments({ clientId, isCompleted: true });

  return NextResponse.json({
    success: true,
    stats: { ongoing, completed },
  });
}
