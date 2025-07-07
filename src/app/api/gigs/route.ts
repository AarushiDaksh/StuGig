import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    const { title, description, budget, clientId, deadline, skills } = body;

    if (!title || !description || !budget || !clientId) {
      return NextResponse.json(
        { success: false, error: "Required fields missing" },
        { status: 400 }
      );
    }

    const newGig = await Gig.create({
      title,
      description,
      budget,
      clientId,
      deadline: deadline ? new Date(deadline) : undefined,
      skills: Array.isArray(skills) ? skills : [],
    });

    return NextResponse.json({ success: true, gig: newGig }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Server error: " + err },
      { status: 500 }
    );
  }
}
