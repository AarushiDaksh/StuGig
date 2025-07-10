import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import WalletFreelancer from "@/models/WalletFreelancer";

export async function GET(req: NextRequest) {
  await connect();
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ success: false });

  let wallet = await WalletFreelancer.findOne({ userId });
  if (!wallet) wallet = await WalletFreelancer.create({ userId });

  return NextResponse.json({ success: true, balance: wallet.balance });
}
