import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, budget } = await req.json();

    if (!title || !description || !budget) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      clientId: session.user.id,
    });

    return NextResponse.json({ success: true, gig });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  await connect();
  try {
    const gigs = await Gig.find().sort({ createdAt: -1 });
    return NextResponse.json({ gigs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
