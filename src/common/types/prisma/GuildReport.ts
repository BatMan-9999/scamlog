import { Prisma } from "@prisma/client";

const guildReportWithCreatedByUser =
  Prisma.validator<Prisma.ServerReportArgs>()({
    include: { createdByUser: true },
  });

export type GuildReportWithCreatedByUser = Prisma.ScamServerGetPayload<
  typeof guildReportWithCreatedByUser
>;
