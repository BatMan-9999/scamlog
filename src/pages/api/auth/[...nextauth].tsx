import NextAuth, { Session } from "next-auth";
import DiscordProvier from "next-auth/providers/discord";
import { prisma } from "@/common/utilities/prisma";
import { AdminUser } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export default NextAuth({
  providers: [
    DiscordProvier({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      await prisma.$connect();
      if (!user) {
        session.admin = false;
        return session;
      }
      const adminUser = await prisma.adminUser.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!adminUser) {
        session.admin = false;
        return session as Session & AdminNotFoundSessionAddition;
      }
      session.admin = adminUser;
      return session as Session & AdminSessionAddition;
    },
  },
  adapter: PrismaAdapter(prisma),
});

interface AdminSessionAddition {
  admin: AdminUser;
}

interface AdminNotFoundSessionAddition {
  admin: false;
}
