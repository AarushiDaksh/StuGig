import { NextResponse } from "next/server";
import connect from "@/utlis/db";
import Gig from "@/models/gigs";

export async function GET(req: Request) {
  await connect();

  const { searchParams } = new URL(req.url);

  // 🧠 Extract query params
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const skills = searchParams.getAll("skills"); // multiple ?skills=one&skills=two
  const minBudget = parseInt(searchParams.get("minBudget") || "0");
  const maxBudget = parseInt(searchParams.get("maxBudget") || "1000000");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // 🔍 Build filter
  const filter: any = {
    budget: { $gte: minBudget, $lte: maxBudget },
  };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (skills.length > 0) {
    filter.skills = { $all: skills }; // must match all
  }

  try {
    const gigs = await Gig.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Gig.countDocuments(filter);

    return NextResponse.json({
      gigs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}