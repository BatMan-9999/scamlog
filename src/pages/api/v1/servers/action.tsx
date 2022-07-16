import checkPerms from "@/modules/auth/permissions/functions/checkPerms";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { opts } from "../../auth/[...nextauth]";
import {prisma} from "@/common/utilities/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

  if (!checkPerms(["MANAGE_SERVERS", "MANAGE_ALL_SERVERS"], { data: session }))
    return res.status(403).json({
      message: "Insufficient permission",
      data: null,
    });

  // User should now be authorized and have appropriate permissions
  await prisma?.$connect();

  const scamServer = await prisma?.scamServer.findUnique({
    where: {
      id: req.body.id,
    },
  });

  if (!scamServer)
    return res.status(404).json({
      message: "Server not found",
      data: null,
    });

  if (req.method === "DELETE") {
    const result = await prisma?.scamServer.delete({
      where: {
        id: req.body.id,
      },
    });

    return res.status(200).json({
      message: "Server deleted",
      data: result,
    });
  }

  if (req.method === "PATCH") {
    const where = {
      id: req.body.id,
    };
    delete req.body.id;
    req.body.updatedAt = new Date();
    delete req.body.createdAt;
    const result = await prisma?.scamServer.update({
      where,
      data: {
        ...req.body,
      },
    });

    return res.status(200).json({
      message: "Server updated",
      data: result,
    });
  }

  return res.status(405).json({
    message: "Method not allowed",
    data: null,
  });
}
