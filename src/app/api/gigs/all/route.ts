import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";
import Bid from "@/models/Bid";

interface LeanGig {
  _id: any; // import { ObjectId } from "mongoose" and use ObjectId
  isCompleted?: boolean;
  [key: string]: any;
}

export async function GET(req: NextRequest) {
  await connect();

  const freelancerId = req.nextUrl.searchParams.get("freelancerId");

  let appliedGigs: Set<string> = new Set();

  if (freelancerId) {
    const bids = await Bid.find({ freelancerId });
    appliedGigs = new Set(bids.map((bid) => bid.gigId.toString()));
  }

  const gigs = await Gig.find().lean();

  const gigsWithStatus = gigs.map((gig: LeanGig) => ({
    ...gig,
    applied: appliedGigs.has(gig._id.toString()),
    isCompleted: gig.isCompleted ?? false,
  }));

  return NextResponse.json({ success: true, gigs: gigsWithStatus });
}
