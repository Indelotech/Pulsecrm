import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      companyId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    companyId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    companyId?: string;
  }
}
