import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import checkPerms from "@/modules/auth/permissions/functions/checkPerms";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { opts } from "../../auth/[...nextauth]";

export default async function Action(
  req: NextApiRequest,
  res: NextApiResponse<StandardAPIResponse>
) {
  if (!req.body)
    return res.status(400).json({
      message: "Request body required",
      data: null,
    });

  if (!req.body.id)
    return res.status(400).json({
      message: "id required",
      data: null,
    });

  if (req.body.id.length !== 24)
    return res.status(400).json({
      message: "id must be 24 characters long",
      data: null,
    });

  const session = await unstable_getServerSession(req, res, opts);

  if (!session)
    return res.status(401).json({
      message: "Not logged in",
      data: null,
    });

  if (!session.admin)
    return res.status(403).json({
      message: "Not an admin",
      data: null,
    });

  if (!checkPerms(["MANAGE_REPORTS"], { data: session }))
    return res.status(403).json({
      message: "Insufficient permission",
      data: null,
    });

  // User should now be authorized and have appropriate permissions
  await prisma?.$connect();

  const report = await prisma?.serverReport.findUnique({
    where: {
      id: req.body.id,
    },
  });

  if (!report)
    return res.status(404).json({
      message: "Report not found",
      data: null,
    });

  if (req.method === "DELETE") {
    const result = await prisma?.serverReport
      .delete({
        where: {
          id: req.body.id,
        },
      })
      .catch((e) => "error" as const);

    if (result === "error")
      return res.status(500).json({
        message: "Error deleting report",
        data: null,
      });

    return res.status(200).json({
      message: "Report deleted",
      data: null,
    });
  }

  if (req.method === "PATCH") {
    const result = await prisma?.serverReport
      .update({
        where: {
          id: req.body.id,
        },
        data: {
          ...req.body,
        },
      })
      .catch((e) => "error" as const);

    if (result === "error")
      return res.status(500).json({
        message: "Error updating report",
        data: null,
      });

    return res.status(200).json({
      message: "Report updated successfully",
      data: null,
    });
  }

  if (req.method === "POST") {
    const result = await prisma?.scamServer.create({
      data: {
        tags: ["User Reported"],
        approvedBy: {
          connect: {
            id: session.admin.id,
          },
        },
        memberCount: report.memberCount,
        name: report.name,
        serverId: report.serverId,
        verificationLevel: report.verificationLevel,
        adminIds: report.adminIds,
        bannerHash: report.bannerHash,
        iconHash: report.iconHash,
        createdAt: report.createdAt,
        createdByUser: {
          connect: {
            id: report.createdByUserId,
          },
        },
        description: report.description,
        evidenceLinks: report.evidenceLinks,
        inviteCodes: report.inviteCodes,
        longReport: report.longReport,
        serverType: report.serverType,
        nsfw: report.nsfw,
        updatedAt: new Date(),
      },
    });

    await prisma?.serverReport.delete({
      where: {
        id: req.body.id,
      },
    });

    return res.status(201).json({
      message: "ScamServer created",
      data: result,
    });
  }

  return res.status(405).json({
    message: "Method not allowed",
    data: null,
  });
}
