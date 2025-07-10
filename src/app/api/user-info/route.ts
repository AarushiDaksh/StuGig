import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import UserFreelancer from "@/models/UserFreelancer";
import UserClient from "@/models/UserClient";

export async function GET(req: NextRequest) {
  await connect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, message: "Missing user ID" }, { status: 400 });
  }

  let user = await UserFreelancer.findById(id).lean();
  if (!user) user = await UserClient.findById(id).lean();
  if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true, user });
}
