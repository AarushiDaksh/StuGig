import { NextResponse } from "next/server";
import { auth } from "@/auth";
// import your db layer as needed
// import { prisma } from "@/lib/prisma";

// GET /api/posts/:id
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }   
) {
  const { id } = await ctx.params;           
  // const post = await prisma.post.findUnique({ where: { id } });
  // if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, id /*, post*/ });
}

// DELETE /api/posts/:id
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }   
) {
  const { id } = await ctx.params;          
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // await prisma.post.delete({ where: { id, userId: session.user.id } });
  return NextResponse.json({ ok: true });
}
