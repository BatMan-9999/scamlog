import { Prisma } from "@prisma/client";

const userWithAdminUser = Prisma.validator<Prisma.UserArgs>()({
  include: {
    AdminUser: true,
  },
});

export type UserWithAdminUser = Prisma.UserGetPayload<typeof userWithAdminUser>;
