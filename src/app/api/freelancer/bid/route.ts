import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Bid from "@/models/Bid";

export async function POST(req: NextRequest) {
  await connect();

  const { gigId, freelancerId, clientId, amount } = await req.json();

  if (!gigId || !freelancerId || !clientId || !amount) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const existing = await Bid.findOne({ gigId, freelancerId });
    if (existing) {
      return NextResponse.json({ success: false, error: "Already applied" }, { status: 409 });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId,
      clientId,
      amount,
      status: "pending",
    });

    return NextResponse.json({ success: true, bid }, { status: 201 });
  } catch (err) {
    console.error("Error creating bid:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
