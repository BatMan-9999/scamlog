import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/common/utilities/prisma";
import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import { ScamServer, ServerReport } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardAPIResponse<ServerReportResponse>>
) {
  if (req.method !== "GET")
    return res.status(405).json({
      message: "Method not allowed. Use GET",
      data: null,
    });

  if (Array.isArray(req.query.cursor))
    return res.status(400).json({
      message: "Cursor must be a string",
      data: null,
    });

  if (Array.isArray(req.query.id))
    return res.status(400).json({
      message: "ID must be a string",
      data: null,
    });

  if (Array.isArray(req.query.name))
    return res.status(400).json({
      message: "Name must be a string",
      data: null,
    });

  if (Array.isArray(req.query.serverId))
    return res.status(400).json({
      message: "ServerId must be a string",
      data: null,
    });

  if (req.query.id && req.query.id?.length !== 24)
    return res.status(400).json({
      message: "ID must be 24 characters long",
      data: null,
    });

  await prisma.$connect();
  const query = await prisma.serverReport.findMany({
    take: 10,
    skip: req.query.cursor ? 1 : 0,
    cursor: req.query.cursor ? { id: req.query.cursor } : undefined,

    where: {
      id: req.query.id || undefined,
      name: req.query.name
        ? {
            contains: req.query.name,
            mode: "insensitive",
          }
        : undefined,
      serverId: req.query.serverId || undefined,
    },

    include: {
      createdByUser: true,
    },
  });

  return res.status(200).json({
    message: "Success",
    data: {
      servers: query,
      cursor: query.at(-1)?.id,
    },
  });
}

export interface ServerReportResponse {
  servers: ServerReport[];
  cursor?: string;
}
