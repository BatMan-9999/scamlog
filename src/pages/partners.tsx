import CardGrid from "@/common/components/base/grid/CardGrid";
import { GetStaticProps } from "next";
import { prisma } from "@/utils/prisma";
import { MovementGuild } from "@prisma/client";
import MovementGuildCard from "@/modules/cards/guilds/MovementGuildCard";

export default function Partners({ partners }: { partners: MovementGuild[] }) {
  return (
    <CardGrid>
      {partners.map((p) => (
        <MovementGuildCard movementGuild={p} key={p.id} />
      ))}
    </CardGrid>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await prisma.$connect();

  return {
    props: {
      partners: await prisma.movementGuild.findMany({}),
    },
    revalidate: 30,
  };
};
