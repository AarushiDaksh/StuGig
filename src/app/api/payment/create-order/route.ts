import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connect from "@/utlis/db";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  await connect();
  const body = await req.json();

  const { amount, gigId, clientId, freelancerId } = body;

  if (!amount || !gigId || !clientId || !freelancerId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        gigId,
        clientId,
        freelancerId,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
  }
}
