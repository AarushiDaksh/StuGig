import connect from "@/utlis/db";
import Payment from "@/models/Payment";

export async function GET(_req: Request) {
  await connect();
  const payments = await Payment.find().populate("hiringId");
  return Response.json({ payments });
}