import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import TransactionFreelancer from "@/models/TransactionFreelancer";

export async function GET(req: NextRequest) {
  await connect();
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ success: false });

  const transactions = await TransactionFreelancer.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, transactions });
}
