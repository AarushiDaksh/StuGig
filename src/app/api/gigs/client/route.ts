import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";
import UserClient from "@/models/UserClient";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await UserClient.findOne({ email: session.user.email });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const gigs = await Gig.find({ clientId: client._id }).populate("freelancerId", "username email");

    return NextResponse.json({ gigs });
  } catch (error) {
    console.error("Error fetching client gigs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
