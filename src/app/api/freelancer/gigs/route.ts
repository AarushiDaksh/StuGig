import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";
import Bid from "@/models/Bid";

export async function GET(req: NextRequest) {
  await connect();

  const freelancerId = req.nextUrl.searchParams.get("freelancerId");

  if (!freelancerId) {
    return NextResponse.json(
      { success: false, error: "Freelancer ID missing" },
      { status: 400 }
    );
  }

  try {
    // All bids by freelancer
    const bids = await Bid.find({ freelancerId }).lean();
    const appliedGigIds = bids.map((bid) => String(bid.gigId));

    // All gigs
    const allGigs = await Gig.find().lean();

    // Completed gigs
    const completedGigs = allGigs.filter(
      (gig) =>
        appliedGigIds.includes(String(gig._id)) &&
        gig.status === "completed" &&
        gig.isCompleted === true
    );

    // Applied gigs (but not completed)
    const appliedGigs = allGigs.filter(
      (gig) =>
        appliedGigIds.includes(String(gig._id)) &&
        (gig.status !== "completed" || !gig.isCompleted)
    );

    // Available gigs: not applied, not completed, open
    const availableGigs = allGigs.filter(
      (gig) =>
        !appliedGigIds.includes(String(gig._id)) &&
        (gig.status === "open" || !gig.status) &&
        !gig.freelancerId
    );

    return NextResponse.json({
      success: true,
      availableGigs,
      appliedGigs,
      completedGigs,
    });
  } catch (error) {
    console.error("Gig Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load gigs" },
      { status: 500 }
    );
  }
}
