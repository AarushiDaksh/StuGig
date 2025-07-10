import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Message from "@/models/Messages";

export async function GET(req: NextRequest) {
  await connect();
  const conversationId = req.nextUrl.searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ success: false, error: "Missing conversationId" }, { status: 400 });
  }

  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
  return NextResponse.json({ success: true, messages });
}

export async function POST(req: NextRequest) {
  await connect();
  const { conversationId, sender, text } = await req.json();

  if (!conversationId || !sender || !text) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const message = await Message.create({ conversationId, sender, text });
  return NextResponse.json({ success: true, message });
}
