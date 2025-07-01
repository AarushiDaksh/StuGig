import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { type NextAuthOptions } from "next-auth";
import { type JWT } from "next-auth/jwt";
import UserClient from "@/models/UserClient";
import UserFreelancer from "@/models/UserFreelancer";
import connect from "@/utlis/db";

export const authOptions: NextAuthOptions = {
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
          name: user.username || user.name || "User",
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
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
