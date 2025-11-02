// src/app/api/posts/[id]/comment/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
// import your DB layer as needed
// import { prisma } from "@/lib/prisma";

type CommentBody = { text?: string };

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 Next 15: params is a Promise
) {
  const { id } = await ctx.params;         // 👈 await it
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CommentBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = (body.text || "").trim();
  if (!text) {
    return NextResponse.json({ error: "Comment text required" }, { status: 400 });
  }

  
  return NextResponse.json({ ok: true /*, comment */ }, { status: 201 });
}
