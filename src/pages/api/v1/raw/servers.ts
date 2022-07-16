import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import checkAuth from "@/modules/rawapi/functions/checkAuth";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/common/utilities/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardAPIResponse>
) {
  const isAuth = await checkAuth(req);

  if (!isAuth) {
    res.status(401).json({
      message: "Unauthorized",
      data: null,
    });
    return;
  }

  await prisma.$connect();

  const result = await prisma.scamServer.findMany({
    select: {
      id: true,
      serverId: true,
      inviteCodes: true,
      name: true,
    },
  });

  return res.status(200).json({
    message: "Success",
    data: {
      servers: result,
    },
  });
}
