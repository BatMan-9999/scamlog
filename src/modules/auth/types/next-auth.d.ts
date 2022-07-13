import { AdminUser } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  type Session = DefaultSession & {
    admin: false | AdminUser;
    id?: string;
  };
}
