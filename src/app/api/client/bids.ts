// src/app/api/client/bids/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utlis/db";
import Bid from "@/models/Bid";
import { authOptions } from "@/lib/authOptions";

export async function GET(_req: NextRequest) {
  await connect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bids = await Bid.find({}).populate("gigId freelancerId");
  return NextResponse.json({ bids });
}
