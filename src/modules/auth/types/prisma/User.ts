import { Prisma } from "@prisma/client";

const userWithAdminUser = Prisma.validator<Prisma.UserArgs>()({
  include: {
    AdminUser: true,
  },
});

const userWithBansAndAdminUser = Prisma.validator<Prisma.UserArgs>()({
  include: {
    AdminUser: true,
    BannedUser: true,
  },
});

export type UserWithAdminUser = Prisma.UserGetPayload<typeof userWithAdminUser>;
export type UserWithBansAndAdminUser = Prisma.UserGetPayload<
  typeof userWithBansAndAdminUser
>;
