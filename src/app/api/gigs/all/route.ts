import { NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function GET() {
  await connect();

  try {
    const gigs = await Gig.find()
      .populate("freelancerId", "username email") // populate name & email
      .sort({ createdAt: -1 });

    return NextResponse.json({ gigs });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
