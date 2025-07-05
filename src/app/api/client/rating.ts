import connect from "@/utlis/db";
import Rating from "@/models/Rating";

export async function GET(_req: Request) {
  await connect();
  const ratings = await Rating.find().populate("freelancerId gigId");
  return Response.json({ ratings });
}
