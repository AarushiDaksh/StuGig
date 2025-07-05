import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";
import Bid from "@/models/Bid";
import Hiring from "@/models/Hiring";
import Payment from "@/models/Payment";
import Rating from "@/models/Rating";
import { authOptions } from "@/lib/authOptions";

export async function GET_PAYMENTS(req: NextRequest) {
  await connect();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payments = await Payment.find({}).populate("hiringId");
  return NextResponse.json({ payments });
}