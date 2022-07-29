import { Prisma } from "@prisma/client";

const scamServerWithCreatedByUserAndApprovedBy =
  Prisma.validator<Prisma.ScamServerArgs>()({
    include: {
      approvedBy: {
        include: {
          user: true,
        },
      },
      createdByUser: true,
    },
  });

export type ScamServerWithCreatedByUserAndApprovedBy =
  Prisma.ScamServerGetPayload<typeof scamServerWithCreatedByUserAndApprovedBy>;
