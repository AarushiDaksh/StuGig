import { NextResponse } from "next/server";
import crypto from "crypto";
import { headers } from "next/headers";
import connect from "@/utlis/db";
import Payment from "@/models/Payment";
import Gig from "@/models/gigs";
import UserClient from "@/models/UserClient";
import UserFreelancer from "@/models/UserFreelancer";

export async function POST(req: Request) {
  await connect();

  const rawBody = await req.text();
  const signature = (await headers()).get("x-razorpay-signature");

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    // Read gig, client, freelancer IDs from metadata
    const { gigId, clientId, freelancerId } = payment.notes || {};

    // Create new payment record
    await Payment.create({
      razorpayPaymentId: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      gig: gigId,
      client: clientId,
      freelancer: freelancerId,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ received: true });
}
