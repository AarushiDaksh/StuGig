// app/api/gigs/freelancer/[freelancerId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function GET(_: NextRequest, { params }: { params: { freelancerId: string } }) {
  await connect();
  try {
    const gigs = await Gig.find({ freelancerId: params.freelancerId }).sort({ createdAt: -1 });
    return NextResponse.json({ gigs });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch gigs" }, { status: 500 });
  }
}
