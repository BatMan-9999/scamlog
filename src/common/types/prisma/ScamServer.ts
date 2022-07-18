import { Prisma } from "@prisma/client";

const scamServerWithCreatedByUserAndApprovedBy =
  Prisma.validator<Prisma.ScamServerArgs>()({
    include: { approvedBy: true, createdByUser: true },
  });

export type ScamServerWithCreatedByUserAndApprovedBy =
  Prisma.ScamServerGetPayload<typeof scamServerWithCreatedByUserAndApprovedBy>;
