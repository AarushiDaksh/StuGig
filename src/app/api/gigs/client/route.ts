// src/app/api/gigs/client/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  await connect();

  const session = await getServerSession(authOptions);
  const clientId = session?.user?.id;

  if (!clientId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const gigs = await Gig.find({ clientId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, gigs });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch gigs" }, { status: 500 });
  }
}
