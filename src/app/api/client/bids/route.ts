// src/app/api/client/bids/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Bid from "@/models/Bid";
import Gig from "@/models/gigs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET bids for the logged-in client
export async function GET(req: NextRequest) {
  await connect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user || user.role !== "client") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  try {
    const bids = await Bid.find()
      .populate("freelancerId", "_id username email")
      .populate("gigId", "_id title clientId");

    const clientBids = bids.filter(
      (bid) => bid.gigId && bid.gigId.clientId.toString() === user.id
    );

    return NextResponse.json({ success: true, bids: clientBids });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch bids" }, { status: 500 });
  }
}

// PUT to accept/reject bid
export async function PUT(req: NextRequest) {
  await connect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user || user.role !== "client") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
  }

  const { bidId, status } = await req.json();

  if (!["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
  }

  try {
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return NextResponse.json({ success: false, error: "Bid not found" }, { status: 404 });
    }

    const gig = await Gig.findById(bid.gigId);
    if (!gig || gig.clientId.toString() !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    bid.status = status;
    await bid.save();

    if (status === "accepted") {
      gig.freelancerId = bid.freelancerId;
      gig.status = "in_progress";
      await gig.save();
    }

    return NextResponse.json({ success: true, message: "Bid updated" });
  } catch (error) {
    console.error("Bid update error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
