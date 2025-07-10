import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import WalletFreelancer from "@/models/WalletFreelancer";
import TransactionFreelancer from "@/models/TransactionFreelancer";

export async function POST(req: NextRequest) {
  await connect();
  const { userId, amount } = await req.json();
  if (!userId || !amount) return NextResponse.json({ success: false });

  await WalletFreelancer.updateOne({ userId }, { $inc: { balance: amount } }, { upsert: true });

  await TransactionFreelancer.create({
    userId,
    amount,
    type: "credit",
    description: "Funds Received",
  });

  return NextResponse.json({ success: true });
}
