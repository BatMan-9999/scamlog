import { StandardAPIResponse } from "@/common/types/api/StandardAPIResponse";
import errorToString from "@/common/utilities/schema/errorToString";
import { NextApiHandler, NextApiResponse } from "next";
import { ObjectId } from "src/schema/v2/ids";
import { prisma } from "@/utils/prisma";

const handler: NextApiHandler = async (
  req,
  res: NextApiResponse<StandardAPIResponse>
) => {
  const { id } = req.query;
  const validId = ObjectId.safeParse(id);

  if (!validId.success)
    return res.status(400).json({
      message: `Invalid ID: ${errorToString(validId)}`,
      data: null,
    });

  const query = await prisma.scamServer.findFirst({
    where: { id: validId.data },
  });

  if (!query) {
    return res.status(404).json({
      message: `Server not found`,
      data: null,
    });
  }

  return res.status(200).json({
    message: `Success`,
    data: query,
  });
};

export default handler;
