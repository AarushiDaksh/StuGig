import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Wallet from "@/models/Wallet";
import Transaction from "@/models/Transactions";

export async function POST(req: NextRequest) {
  await connect();
  const { userId, amount } = await req.json();

  if (!userId || !amount) {
    return NextResponse.json({ success: false, message: "Missing userId or amount" }, { status: 400 });
  }

  // Update or create wallet
  await Wallet.updateOne(
    { userId },
    { $inc: { balance: amount } },
    { upsert: true }
  );

  // Log transaction
  await Transaction.create({
    userId,
    amount,
    type: "credit",
    description: "Funds Added",
  });

  return NextResponse.json({ success: true, message: "Balance added successfully" });
}
