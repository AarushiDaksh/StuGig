import connect from "@/utlis/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import UserFreelancer from "@/models/UserFreelancer";
import UserClient from "@/models/UserClient";

export const POST = async (request: Request) => {
  try {
    const { username, email, password, role } = await request.json();

    if (!username || !email || !password || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!["freelancer", "client"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    await connect();

    const Model = role === "freelancer" ? UserFreelancer : UserClient;
    const existingUser = await Model.findOne({ email });

    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Model({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    return new NextResponse("User registered successfully", { status: 200 });
  } catch (err) {
    console.error("Signup error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
