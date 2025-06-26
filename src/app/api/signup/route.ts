import User from "@/models/User";
import connect from "@/utlis/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return new NextResponse("User registered successfully", { status: 200 });

  } catch (err) {
    console.error("Signup error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
