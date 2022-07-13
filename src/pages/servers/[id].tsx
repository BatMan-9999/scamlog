import ScamServerCardReport from "@/modules/report/components/ScamServerCardReport";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { prisma } from "@/common/utilities/prisma";
import { ScamServer, User } from "@prisma/client";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { Tooltip } from "@nextui-org/react";
import UserCard from "@/modules/auth/components/UserCard";

export default function ID({
  data,
  text,
}: {
  data: false | (ScamServer & { createdByUser: User | null });
  text: MDXRemoteSerializeResult;
}) {
  if (!data) return <div className="text-center font-bold text-error">404</div>;

  return (
    <div className="mx-2 md:mx-4 grid grid-cols-1 grid-rows-2 lg:grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="flex justify-center flex-col items-center md:row-span-2">
        <ScamServerCardReport {...data} />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <div className="prose lg:prose-xl">
          <h2>Long Report</h2>
          <MDXRemote {...text} />

          <br />

          <Tooltip content="This referrs to the description set by the scam server owners">
            <h2>Server Description</h2>
          </Tooltip>
          <p>{data.description ?? "No description set"}</p>

          <h2>Submitted By</h2>
          {data.createdByUser ? (
            <UserCard {...data.createdByUser} />
          ) : (
            <p>System</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  await prisma.$connect();

  const prismaQuery = await prisma.scamServer.findFirst({
    where: {
      id: context.params?.id as string,
    },
    include: {
      createdByUser: true,
    },
  });

  if (!prismaQuery)
    return {
      props: {
        data: false,
      },
    };

  return {
    props: {
      data: JSON.parse(JSON.stringify(prismaQuery)),
      text: await serialize(prismaQuery.longReport ?? ""),
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  await prisma.$connect();

  const prismaQuery = await prisma.scamServer.findMany({
    select: {
      id: true,
    },
  });

  const paths = prismaQuery.map((server) => ({
    params: {
      id: server.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};
