// /api/admin/gigs/route.ts
import Gig from "@/models/gigs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // same admin check
  const gigs = await Gig.find().lean();
  return NextResponse.json({ gigs });
}

export async function DELETE(req: NextRequest) {
  const { gigId } = await req.json();
  await Gig.findByIdAndDelete(gigId);
  return NextResponse.json({ success: true });
}
