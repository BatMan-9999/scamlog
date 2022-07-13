import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import checkPerms from "@/modules/auth/permissions/functions/checkPerms";
import { ScamServer } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { opts } from "../../auth/[...nextauth]";
import { prisma } from "@/common/utilities/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardAPIResponse<ScamServer | undefined>>
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

  if (!session.admin)
    return res.status(403).json({
      message: "Forbidden - you are not admin",
      data: null,
    });

  if (!checkPerms(["MANAGE_ALL_SERVERS", "MANAGE_SERVERS"], { data: session }))
    return res.status(403).json({
      message: "Insufficient permissions",
      data: null,
    });

  // User is authenticated and can now access API
  if (!req.body)
    return res.status(400).json({
      message: "Missing body",
      data: null,
    });

  if (!req.body?.serverId)
    return res.status(400).json({
      message: "Missing serverId",
      data: null,
    });

  if (!Array.isArray(req.body.inviteCodes) || !req.body.inviteCodes?.length)
    return res.status(400).json({
      message: "Missing inviteCodes",
      data: null,
    });

  if (!req.body.name)
    return res.status(400).json({
      message: "Missing name",
      data: null,
    });

  if (
    req.body.verificationLevel === null ||
    req.body.verificationLevel === undefined
  )
    return res.status(400).json({
      message: "Missing verificationLevel",
      data: null,
    });

  if (typeof req.body.verificationLevel !== "number")
    return res.status(400).json({
      message: "verificationLevel must be a number",
      data: null,
    });
  if (req.body.verificationLevel < 0 || req.body.verificationLevel > 4)
    return res.status(400).json({
      message: "verificationLevel must be between 0 and 4 (inclusive)",
      data: null,
    });

  if (typeof req.body.memberCount !== "number")
    return res.status(400).json({
      message: "memberCount must be a number",
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
  await prisma?.$connect();

  const dupe = await prisma.scamServer.findFirst({
    where: {
      serverId: req.body.serverId,
    },
  });

  if (dupe)
    return res.status(409).json({
      message: "Server ID already exists",
      data: null,
    });

  const returned = await prisma?.scamServer.create({
    data: {
      createdByUser: {
        connect: {
          id: session.admin.userId,
        },
      },
      memberCount: req.body.memberCount,
      name: req.body.name,
      verificationLevel: req.body.verificationLevel,
      inviteCodes: req.body.inviteCodes,
      serverId: req.body.serverId,
      adminIds: req.body.adminIds ?? [],
      bannerHash: req.body.bannerHash,
      description: req.body.description,
      evidenceLinks: req.body.evidenceLinks ?? [],
      isActive: true,
      longReport: req.body.longReport,
      nsfw: req.body.nsfw,
      tags: req.body.tags ?? [],
      serverType: req.body.serverType,
      iconHash: req.body.iconHash,
    },
  });

  res.status(201).json({
    message: "Created",
    data: returned,
  });
}
