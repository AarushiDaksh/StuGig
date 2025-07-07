import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import UserClient from "@/models/UserClient";
import UserFreelancer from "@/models/UserFreelancer";

export async function GET(req: NextRequest) {
  await connect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");

  if (!userId || !role) {
    return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
  }

  try {
    const Model = role === "freelancer" ? UserFreelancer : UserClient;
    const user = await Model.findById(userId).select("username email firstName lastName profilePicture");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
