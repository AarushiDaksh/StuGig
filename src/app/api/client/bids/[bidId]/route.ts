import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Bid from "@/models/Bid";
import Gig from "@/models/gigs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PUT(req: NextRequest) {
  try {
    await connect();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "client") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Extract bidId manually from URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const bidId = pathSegments[pathSegments.length - 1];

    const { status } = await req.json();

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return NextResponse.json({ success: false, message: "Bid not found" }, { status: 404 });
    }

    const gig = await Gig.findById(bid.gigId);
    if (!gig || gig.clientId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized or gig not found" }, { status: 403 });
    }

    if (bid.status !== "pending") {
      return NextResponse.json({ success: false, message: "Bid already acted upon" }, { status: 400 });
    }

    bid.status = status;
    await bid.save();

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error("Error updating bid:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
