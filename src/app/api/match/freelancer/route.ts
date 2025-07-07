// src/app/api/match/freelancer/route.ts
import { NextResponse } from "next/server";
import connect from "@/utlis/db";
import UserFreelancer from "@/models/UserFreelancer";
import Job from "@/models/gigs";
import { calculateMatchScore } from "@/lib/matchUtlis";

export async function POST(req: Request) {
  await connect();
  const { freelancerId } = await req.json();

  const freelancer = await UserFreelancer.findById(freelancerId);
  const jobs = await Job.find({}); // You can filter by category if needed

  const matches = jobs.map((job) => {
    const score = calculateMatchScore(freelancer, job);
    return { job, score };
  });

  const sorted = matches.sort((a, b) => b.score - a.score);
  return NextResponse.json({ success: true, recommendations: sorted.slice(0, 5) });
}
