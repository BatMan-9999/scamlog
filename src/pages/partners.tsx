import CardGrid from "@/common/components/base/grid/CardGrid";
import { GetStaticProps } from "next";
import { prisma } from "@/utils/prisma";
import { MovementGuild } from "@prisma/client";

export default function Partners({ partners }: { partners: MovementGuild[] }) {
  return <CardGrid></CardGrid>;
}

export const getStaticProps: GetStaticProps = async () => {
  await prisma.$connect();

  return {
    props: {
      partners: await prisma.movementGuild.findMany({}),
    },
  };
};
