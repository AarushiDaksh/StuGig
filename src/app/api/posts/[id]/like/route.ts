// src/app/api/posts/[id]/like/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// POST /api/posts/:id/like  -> like a post
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 NOTE: Promise
) {
  const { id } = await ctx.params;         // 👈 await params
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: persist the like in DB (e.g., prisma/postModel)
  // await prisma.like.upsert({ where: { postId_userId: { postId: id, userId: session.user.id } }, ... })

  return NextResponse.json({ ok: true });
}

// DELETE /api/posts/:id/like -> unlike a post
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> } // 👈 NOTE: Promise
) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: delete the like in DB
  // await prisma.like.delete({ where: { postId_userId: { postId: id, userId: session.user.id } } })

  return NextResponse.json({ ok: true });
}
