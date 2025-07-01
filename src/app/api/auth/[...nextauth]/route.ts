// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserClient from "@/models/UserClient";
import UserFreelancer from "@/models/UserFreelancer";
import connect from "@/utlis/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, 
      },
      async authorize(credentials) {
        await connect();

        if (!credentials?.email || !credentials?.password || !credentials?.role)
          return null;

        const Model =
          credentials.role === "freelancer"
            ? UserFreelancer
            : credentials.role === "client"
            ? UserClient
            : null;

        if (!Model) return null;

        const user = await Model.findOne({ email: credentials.email });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: credentials.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role; // 👈 add to token
    }
    return token;
  },
  async session({ session, token }) {
    session.user.role = token.role as string; // 👈 now it works in session.user
    return session;
  },
},

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };