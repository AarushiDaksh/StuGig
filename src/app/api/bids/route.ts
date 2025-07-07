import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Bid from "@/models/Bid";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { gigId, clientId, freelancerId, amount, proposal } = await req.json();

    if (!gigId || !clientId || !freelancerId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bid = await Bid.create({
      gigId,
      clientId,
      freelancerId,
      amount,
      proposal,
    });

    return NextResponse.json({ success: true, bid }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
