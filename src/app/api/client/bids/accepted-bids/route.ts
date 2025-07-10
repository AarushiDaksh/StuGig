// /api/client/bids/accepted-bids/route.ts

import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Bid from "@/models/Bid";

export async function GET(req: NextRequest) {
  await connect();

  const clientId = req.nextUrl.searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ success: false, error: "Missing clientId" }, { status: 400 });
  }

  try {
    const acceptedBids = await Bid.find({
      clientId,
      isAccepted: true,
    }).populate("freelancerId gigId");

    return NextResponse.json({ success: true, acceptedBids });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch accepted bids" }, { status: 500 });
  }
}
