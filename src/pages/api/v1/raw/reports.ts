import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import checkAuth from "@/modules/rawapi/functions/checkAuth";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/common/utilities/prisma";
import { APIInvite } from "discord-api-types/v10";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardAPIResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
      data: null,
    });
  }

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

  if (
    !["QR", "FAKENITRO", "OAUTH", "VIRUS", "NSFW", "SPAM", "OTHER"].includes(
      req.body.serverType
    )
  )
    return res.status(400).json({
      message:
        "serverType must be one of the following: QR, FAKENITRO, OAUTH, VIRUS, NSFW, SPAM, OTHER",
      data: null,
    });

  const isAuth = await checkAuth(req);

  if (!isAuth) {
    res.status(401).json({
      message: "Unauthorized",
      data: null,
    });
    return;
  }

  await prisma.$connect();

  if (req.body.adminIds?.length) {
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
      createdByUser: {
        connect: {
          id: "62db418ccbf1eedadf97f0ad",
        },
      },
    },
  });

  return res.status(201).json({
    message: "Success",
    data: returned,
  });
}
