import connect from "@/utlis/db";
import Hiring from "@/models/Hiring";

export async function GET(_req: Request) {
  await connect();
  const hirings = await Hiring.find().populate("gigId freelancerId");
  return Response.json({ hirings });
}