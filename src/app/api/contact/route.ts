import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL_STUGIG,
      pass: process.env.SMTP_PASS_STUGIG,
    },
  });

  const mailOptions = {
    from: `"StuGig" <${process.env.SMTP_EMAIL_STUGIG}>`,
    to: process.env.SMTP_EMAIL_STUGIG,
    subject: `📬 New Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
