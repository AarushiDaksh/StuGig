import { NextRequest, NextResponse } from "next/server";
import connect from "@/utlis/db";
import Conversation from "@/models/conversation";

export async function GET(req: NextRequest) {
  await connect();

  const user1 = req.nextUrl.searchParams.get("user1");
  const user2 = req.nextUrl.searchParams.get("user2");

  if (!user1 || !user2) {
    return NextResponse.json({ success: false, error: "Missing user IDs" }, { status: 400 });
  }

  const existing = await Conversation.findOne({
    members: { $all: [user1, user2] },
  });

  if (existing) {
    return NextResponse.json({ success: true, conversation: existing });
  }

  const newConversation = await Conversation.create({ members: [user1, user2] });
  return NextResponse.json({ success: true, conversation: newConversation });
}
