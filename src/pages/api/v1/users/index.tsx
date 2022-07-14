import checkPerms from "@/modules/auth/permissions/functions/checkPerms";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { opts } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  if (!checkPerms(["MODERATE_MEMBERS", "ADMIN"], { data: session }))
    return res.status(403).json({
      message: "Insufficient permission",
      data: null,
    });

  if (Array.isArray(req.query.cursor))
    return res.status(400).json({
      message: "Cursor must be a string",
      data: null,
    });

  if (Array.isArray(req.query.name))
    return res.status(400).json({
      message: "Name must be a string",
      data: null,
    });

  // User should now be authorized and have appropriate permissions
  await prisma?.$connect();

  const results = await prisma?.user.findMany({
    take: 30,
    skip: req.query.cursor ? 1 : 0,
    where: {
      name: req.query.name
        ? {
            contains: req.query.name,
            mode: "insensitive",
          }
        : undefined,
    },
    cursor: req.query.cursor
      ? {
          id: req.query.cursor,
        }
      : undefined,
  });

  return res.status(200).json({
    message: "Success",
    data: results ?? [],
  });
}
