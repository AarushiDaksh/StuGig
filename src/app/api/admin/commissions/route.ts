// /api/admin/commissions/route.ts
import Commission from "@/models/Commission"; 
import { NextResponse } from "next/server";

export async function GET() {
  const commissions = await Commission.find().lean();
  return NextResponse.json({ commissions });
}
