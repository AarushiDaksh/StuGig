import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Wallet from "@/models/Wallet";

export async function GET(req: NextRequest) {
  await connect();

  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Missing userId" },
      { status: 400 }
    );
  }

  // Find wallet or create new
  let wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    wallet = await Wallet.create({ userId });
  }

  return NextResponse.json({
    success: true,
    balance: wallet.balance,
  });
}
