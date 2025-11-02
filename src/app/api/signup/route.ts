import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connect from "@/utlis/db";            
import User from "@/models/Users";           

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional(),              
});

export async function POST(req: Request) {
  try {
    await connect();

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { username, email, password, role } = parsed.data;

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashed,
      role: role ?? "user",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
