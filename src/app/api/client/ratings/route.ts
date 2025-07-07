import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Rating from "@/models/Rating";

export async function POST(req: NextRequest) {
  await connect();
  try {
    const body = await req.json();
    const { clientId, freelancerId, gigId, rating, review } = body;

    if (!clientId || !freelancerId || !gigId || !rating) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const newRating = await Rating.create({ clientId, freelancerId, gigId, rating, review });

    return NextResponse.json({ success: true, rating: newRating }, { status: 201 });
  } catch (error) {
    console.error("Error rating", error);
    return NextResponse.json({ error: "Failed to rate" }, { status: 500 });
  }
}
