// src/app/api/chat/message/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Message from "@/models/Messages";

export async function GET(req: NextRequest) {
  await connect();

  const conversationId = new URL(req.url).searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { success: false, error: "Missing conversationId" },
      { status: 400 }
    );
  }

  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

  if (!messages) {
    return NextResponse.json({ success: false, error: "No messages found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, messages }, { status: 200 });
}

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { conversationId, sender, text } = await req.json();

    if (!conversationId || !sender || !text) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const message = await Message.create({ conversationId, sender, text });
    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
