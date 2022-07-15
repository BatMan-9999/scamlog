import ScamServerCard from "@/modules/search/components/display/ScamServerCard";
import ScamServersContainer from "@/modules/search/components/display/ScamServersDisplay";
import { ScamServer } from "@prisma/client";
import { GetStaticProps } from "next";
import { useInfiniteQuery } from "react-query";
import { prisma } from "@/common/utilities/prisma";
import { useState } from "react";

/**
 * How this page works:
 *
 * Fetch the first page of scam servers from the database, and display them statically
 * When the user clicks Load More, begin using the API to load them
 */

export default function Index({
  scamServers,
  initialCursor,
}: {
  scamServers: ScamServer[];
  initialCursor: string;
}) {
  const [loadedFromAPI, setLoadedFromAPI] = useState(false);

  const fetchScamServer = ({ pageParam }: { pageParam?: string }) =>
    fetch(`/api/v1/servers${pageParam ? `?cursor=${pageParam}` : ""}`).then(
      (res) => res.json()
    );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
  } = useInfiniteQuery("scamservers", fetchScamServer, {
    getNextPageParam: (lastPage) => lastPage?.data?.cursor ?? null,
    enabled: loadedFromAPI,
  });
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <ScamServersContainer>
          {scamServers.map((server) => (
            <ScamServerCard key={server.id} {...server} />
          ))}
          {data?.pages.map((page) =>
            page?.data?.servers?.map?.((server: ScamServer) => (
              <ScamServerCard key={server.id} {...server} />
            ))
          )}
        </ScamServersContainer>
      </div>
      <div className="flex flex-col items-center justify-center">
        {loadedFromAPI ? (
          <button
            onClick={() => {
              fetchNextPage();
              setLoadedFromAPI(true);
            }}
            className={`btn btn-primary btn-wide ${
              status === "loading" ? "loading" : ""
            }`}
            disabled={!hasNextPage}
          >
            {hasNextPage ? "Load more" : "You've reached the end!"}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => {
              setLoadedFromAPI(true);
              fetchNextPage({
                pageParam: initialCursor,
              });
            }}
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await prisma.$connect();

  const scamServers = await prisma.scamServer.findMany({
    take: 10,
  });

  return {
    props: {
      scamServers: scamServers.map((server) => ({
        ...server,
        createdAt: server.createdAt.toISOString(),
        updatedAt: server.updatedAt.toISOString(),
      })),
      initialCursor: scamServers[scamServers.length - 1].id,
    },
    revalidate: 5,
  };
};
