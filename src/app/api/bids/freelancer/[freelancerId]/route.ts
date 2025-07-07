// app/api/bids/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Bid from "@/models/Bid";

export async function POST(req: NextRequest) {
  await connect();

  const { gigId, clientId, freelancerId, amount, proposal } = await req.json();

  if (!gigId || !freelancerId || !amount || !proposal) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  // Prevent duplicate applications
  const existingBid = await Bid.findOne({ gigId, freelancerId });
  if (existingBid) {
    return NextResponse.json({ success: false, error: "Already applied" }, { status: 409 });
  }

  const bid = await Bid.create({ gigId, clientId, freelancerId, amount, proposal });

  return NextResponse.json({ success: true, bid }, { status: 201 });
}
