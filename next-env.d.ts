/// <reference types="next" />
/// <reference types="next/image-types/global" />


// src/next-auth.d.ts or src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; 
    };
  }

  interface User {
    role?: string; 
  }
}

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
