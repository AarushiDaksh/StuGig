import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { title, description, budget, freelancerId } = await req.json();

    //required fields
    if (!title || !description || !budget || !freelancerId) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    //Create the gig
    const gig = await Gig.create({ title, description, budget, freelancerId });

    return NextResponse.json({ success: true, gig }, { status: 201 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
