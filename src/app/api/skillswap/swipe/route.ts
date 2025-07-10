// app/api/skillswap/swipe/route.ts
import SwapIntent from "@/models/SwapIntent";
import SwapMatch from "@/models/SwapMatch";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";

export async function POST(req: NextRequest) {
  await connect();

  const { fromUser, toUser, direction } = await req.json();

  await SwapIntent.create({ fromUser, toUser, direction });

  if (direction === "right") {
    const reverse = await SwapIntent.findOne({
      fromUser: toUser,
      toUser: fromUser,
      direction: "right",
    });

    if (reverse) {
      await SwapMatch.create({ users: [fromUser, toUser] });
      return NextResponse.json({ matched: true });
    }
  }

  return NextResponse.json({ matched: false });
}
