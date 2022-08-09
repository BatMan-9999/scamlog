import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import checkPerms from "@/modules/auth/permissions/functions/checkPerms";
import { ScamServer, ServerReport } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { opts } from "../../auth/[...nextauth]";
import { prisma } from "@/common/utilities/prisma";
import { APIInvite } from "discord-api-types/v10";
import { ObjectServerTypeTranslation } from "@/modules/translation/enum/ServerType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardAPIResponse<ServerReport | undefined>>
) {
  if (req.method !== "POST")
    return res.status(405).json({
      message: "Method not allowed. Use POST",
      data: null,
    });

  const session = await unstable_getServerSession(req, res, opts);

  if (!session)
    return res.status(401).json({
      message: "Unauthorized",
      data: null,
    });

  // User is authenticated and can now access API
  if (!req.body)
    return res.status(400).json({
      message: "Missing body",
      data: null,
    });

  if (!Array.isArray(req.body.inviteCodes) || !req.body.inviteCodes?.length)
    return res.status(400).json({
      message: "Missing inviteCodes",
      data: null,
    });

  console.log(ObjectServerTypeTranslation);

  if (!Object.keys(ObjectServerTypeTranslation).includes(req.body.serverType))
    return res.status(400).json({
      message: `serverType must be one of the following: ${Object.keys(
        ObjectServerTypeTranslation
      ).join(", ")}`,
      data: null,
    });
  await prisma?.$connect();

  if (session.id) {
    const isBanned = await prisma.bannedUser.findFirst({
      where: {
        userId: session.id,
      },
    });
    if (isBanned)
      return res.status(403).json({
        message: "You are banned",
        data: null,
      });

    const user = await prisma.user.findFirst({
      where: {
        id: session.id,
      },
    });

    if (user) {
      if (user.reportCoolDown) {
        if (user.reportCoolDown.getTime() > Date.now())
          return res.status(429).json({
            message: `Too fast! You can report again in ${
              user.reportCoolDown.getTime() - Date.now()
            }ms`,
            data: null,
          });
      }
    }
  }

  if (req.body.adminIds.length) {
    if (
      req.body.adminIds.some((id: number | string) => id.toString().length < 17)
    )
      return res.status(400).json({
        message: "Admin IDs cannot be less than 17 digits",
        data: null,
      });
  }

  if (!req.body?.inviteCodes?.length)
    return res.status(400).json({
      message: "Missing inviteCodes",
      data: null,
    });

  if (req.body.inviteCodes.some((code: string) => code.length < 3))
    return res.status(400).json({
      message: "Invite codes must be at least 3 characters long",
      data: null,
    });

  // Fetch data from Discord
  const invite: APIInvite | null = await fetch(
    `https://discord.com/api/v10/invites/${req.body.inviteCodes[0]}?with_counts=true`
  ).then((res) => res.json());

  if (!invite?.guild)
    return res.status(404).json({
      message: "Invite not found",
      data: null,
    });

  const dupe = await prisma.serverReport.findFirst({
    where: {
      serverId: invite.guild.id,
    },
  });

  const dbDupe = await prisma.scamServer.findFirst({
    where: {
      serverId: invite.guild.id,
    },
  });

  if (dupe || dbDupe)
    return res.status(409).json({
      message: "Server ID already exists",
      data: null,
    });

  const returned = await prisma?.serverReport.create({
    data: {
      createdByUser: {
        connect: {
          id: session.id,
        },
      },
      memberCount: invite.approximate_member_count!,
      name: invite.guild.name,
      verificationLevel: invite.guild.verification_level ?? 0,
      inviteCodes: req.body.inviteCodes,
      serverId: invite.guild.id,
      adminIds: req.body.adminIds ?? [],
      bannerHash: invite.guild.banner,
      description: invite.guild.description,
      evidenceLinks: req.body.evidenceLinks ?? [],
      isActive: true,
      longReport: req.body.longReport,
      nsfw: req.body.nsfw,
      serverType: req.body.serverType,
      iconHash: invite.guild.icon,
    },
  });

  if (session.id)
    prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        // Cooldown is 2 minutes
        reportCoolDown: new Date(Date.now() + 120_000),
      },
    });

  res.status(201).json({
    message: "Created",
    data: returned,
  });
}
