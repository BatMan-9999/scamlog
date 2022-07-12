import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StandardAPIResponse<number>>
) {
  await prisma.$connect();

  const result = await prisma.scamServer.count();

  return res.status(200).json({
    message: `Success`,
    data: result,
  });
}
