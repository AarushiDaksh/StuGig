import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Transaction from "@/models/Transactions";

export async function GET(req: NextRequest) {
  await connect();
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ success: false, error: "Missing userId" });

  const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, transactions });
}
