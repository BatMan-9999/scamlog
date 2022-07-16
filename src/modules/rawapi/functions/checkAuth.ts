import { prisma } from "@/common/utilities/prisma";
import { NextApiRequest } from "next";

export default async function checkAuth(req: NextApiRequest) {
  if (!req.headers.authorization) return false;

  const [type, token] = req.headers.authorization.split(" ");

  if (type !== "Bearer") return false;

  await prisma.$connect();

  const user = await prisma.aPIKey.findFirst({
    where: {
      key: token,
    },
  });

  if (!user) return false;
  return true;
}
