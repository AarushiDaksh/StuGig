// app/api/chat/connections/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Bid from "@/models/Bid";
import UserFreelancer from "@/models/UserFreelancer";
import UserClient from "@/models/UserClient";

export async function GET(req: NextRequest) {
  await connect();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const role = url.searchParams.get("role"); // "client" or "freelancer"

  if (!userId || !role) {
    return NextResponse.json({ success: false, error: "Missing params" }, { status: 400 });
  }

  let connections = [];

  if (role === "client") {
    const acceptedBids = await Bid.find({ clientId: userId, status: "accepted" }).populate("freelancerId");
    connections = acceptedBids.map((bid) => bid.freelancerId);
  } else {
    const acceptedBids = await Bid.find({ freelancerId: userId, status: "accepted" }).populate("clientId");
    connections = acceptedBids.map((bid) => bid.clientId);
  }

  return NextResponse.json({ success: true, connections });
}
