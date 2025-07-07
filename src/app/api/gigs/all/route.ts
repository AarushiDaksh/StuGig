// app/api/gigs/all/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";
import Bid from "@/models/Bid";

export async function GET(req: NextRequest) {
  await connect();

  const freelancerId = req.nextUrl.searchParams.get("freelancerId");

  const gigs = await Gig.find().lean();

  let appliedGigs: Set<string> = new Set();

  if (freelancerId) {
    const bids = await Bid.find({ freelancerId });
    appliedGigs = new Set(bids.map((bid) => bid.gigId.toString()));
  }

    const gigsWithAppliedFlag = gigs.map((gig) => ({
      ...gig,
      applied: appliedGigs.has(String(gig._id)),
    }));


  return NextResponse.json({ success: true, gigs: gigsWithAppliedFlag });
}
