import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import userActions from "@/modules/auth/enum/userActions";
import checkPerms from "@/modules/auth/permissions/functions/checkPerms";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { opts } from "../../auth/[...nextauth]";
import { prisma } from "@/common/utilities/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardAPIResponse>
) {
  if (req.method !== "POST")
    return res.status(405).json({
      message: "Method not allowed",
      data: null,
    });

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

  if (!req.body.action)
    return res.status(400).json({
      message: "Action required",
      data: null,
    });

  if (typeof req.body.action !== "string")
    return res.status(400).json({
      message: "Action must be a string",
      data: null,
    });

  if (!userActions.includes(req.body.action))
    return res.status(400).json({
      message: "Action not recognized",
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

  if (!checkPerms(["ADMIN", "MODERATE_MEMBERS"], { data: session }))
    return res.status(403).json({
      message: "Insufficient permission",
      data: null,
    });

  // User should now be authorized and have appropriate permissions
  await prisma?.$connect();

  const target = await prisma?.user.findUnique({
    where: {
      id: req.body.id,
    },
    include: {
      Account: true,
    },
  });

  if (!target)
    return res.status(404).json({
      message: "User not found",
      data: null,
    });

  const isAdmin = await prisma.adminUser.findFirst({
    where: {
      user: {
        id: target?.id,
      },
    },
  });

  if (
    req.body.action === "BAN" &&
    !checkPerms(["ROOT"], { data: session }) &&
    isAdmin
  )
    return res.status(403).json({
      message:
        "Insufficient permission, bannning admins is not allowed unless you are ROOT",
      data: null,
    });
  if (!checkPerms(["ADMIN"], { data: session })) {
    if (req.body.action === "PERMISSION")
      return res.status(403).json({
        message: "Insufficient permissions - You require ADMIN",
        data: null,
      });

    if (req.body.action === "DELETE")
      return res.status(403).json({
        message: "Insufficient permissions - You require ADMIN",
        data: null,
      });
  }

  if (req.body.action === "BAN") {
    const ban = await prisma.bannedUser.create({
      data: {
        user: {
          connect: {
            id: target?.id,
          },
          
        },
        adminUser: {
          connect: {
            id: session.admin.id,
          },
        },
        reason: req.body.reason ?? "No reason provided",
        discordId: target.Account[0].providerAccountId,
      },
    });

    return res.status(200).json({
      message: "User banned",
      data: ban,
    });
  }

  if (req.body.action === "UNBAN") {
    const ban = await prisma.bannedUser.findFirst({
      where: {
        user: {
          id: target?.id,
        },
      },

      include: {
        adminUser: true,
        user: true,
      },
    });

    if (!ban)
      return res.status(404).json({
        message: "User ban not found",
        data: null,
      });

    if (
      ban.adminUser.permissions.includes("ROOT") &&
      !checkPerms(["ROOT"], { data: session })
    )
      return res.status(403).json({
        message:
          "Insufficient permission. You must be root to remove a ban created by a root user",
        data: null,
      });

    const result = await prisma.bannedUser
      .delete({
        where: {
          id: ban.id,
        },
      })
      .catch((e) => null);

    if (!result)
      return res.status(500).json({
        message: "Error removing ban",
        data: null,
      });

    return res.status(200).json({
      message: "User unbanned",
      data: result,
    });
  }
}
