// src/app/api/client/gigs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";
import UserClient from "@/models/UserClient";

// GET all gigs posted by a client
export async function GET(req: NextRequest) {
  await connect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "client") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gigs = await Gig.find({ clientId: session.user.id });
  return NextResponse.json({ gigs });
}

// POST a new gig
export async function POST(req: NextRequest) {
  try {
    await connect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, budget } = await req.json();

    const client = await UserClient.findOne({ email: session.user.email });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const newGig = new Gig({
      title,
      description,
      budget,
      clientId: client._id,
    });

    const savedGig = await newGig.save();
    return NextResponse.json({ gig: savedGig }, { status: 201 });
  } catch (error) {
    console.error("Error creating gig:", error);
    return NextResponse.json({ error: "Failed to create gig" }, { status: 500 });
  }
}
