import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/auth";

import connect from "@/utlis/db";           
import Post from "@/models/Posts";            

export async function GET() {
  await connect();
  const posts = await Post.find({})
    .populate("author", "username image")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return NextResponse.json({ posts }, { status: 200 });
}

export async function POST(req: Request) {
  const session = await auth();
if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, image } = await req.json();
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  await connect();
  const created = await Post.create({
    author: userId,
    content: content.trim(),
    image: image || "",
  });

  return NextResponse.json({ post: created }, { status: 201 });
}
