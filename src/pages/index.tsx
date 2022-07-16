import { ScamServer } from "@prisma/client";
import { useInfiniteQuery } from "react-query";
import { useState } from "react";
import { ViewReportScamGuildCard } from "@/modules/cards/guilds/ViewReportScamGuildCard";
import FlexCenter from "@/common/components/base/flex/FlexCenter";
import FlexGrid from "@/common/components/base/flex/FlexGrid";

/**
 * How this page works:
 *
 * Fetch the first page of scam servers from the database, and display them statically
 * When the user clicks Load More, begin using the API to load them
 */

export default function Index() {
  const fetchScamServer = ({ pageParam }: { pageParam?: string }) =>
    fetch(`/api/v1/servers${pageParam ? `?cursor=${pageParam}` : ""}`).then(
      (res) => res.json()
    );

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery(
    "scamservers",
    fetchScamServer,
    {
      getNextPageParam: (lastPage) => lastPage?.data?.cursor ?? null,
    }
  );
  return (
    <>
      <FlexCenter>
        <FlexGrid>
          {data?.pages.map((page) =>
            page?.data?.servers?.map?.((server: ScamServer) => (
              <ViewReportScamGuildCard key={server.id} {...server} />
            ))
          )}
        </FlexGrid>
      </FlexCenter>
      <FlexCenter>
        <button
          onClick={() => {
            fetchNextPage();
          }}
          className={`btn btn-primary btn-wide ${
            status === "loading" ? "loading" : ""
          }`}
          disabled={!hasNextPage}
        >
          {hasNextPage ? "Load more" : "You've reached the end!"}
        </button>
      </FlexCenter>
    </>
  );
}
