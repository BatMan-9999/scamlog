import ScamServerCard from "@/modules/search/components/display/ScamServerCard";
import ScamServersContainer from "@/modules/search/components/display/ScamServersDisplay";
import { ScamServer } from "@prisma/client";
import { useInfiniteQuery } from "react-query";

export default function Index() {
  const fetchScamServer = ({ pageParam }: { pageParam?: string }) =>
    fetch(`/api/v1/servers${pageParam ? `?cursor=${pageParam}` : ""}`).then(
      (res) => res.json()
    );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("scamservers", fetchScamServer, {
    getNextPageParam: (lastPage) => lastPage?.data?.cursor ?? null,
  });
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <ScamServersContainer>
          {data?.pages.map((page) =>
            page?.data?.servers?.map?.((server: ScamServer) => (
              <ScamServerCard key={server.id} {...server} />
            ))
          )}
        </ScamServersContainer>
      </div>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => fetchNextPage()}
          className={`btn btn-primary btn-wide ${
            status === "loading" ? "loading" : ""
          }`}
          disabled={!hasNextPage}
        >
          {hasNextPage ? "Load more" : "You've reached the end!"}
        </button>
      </div>
    </>
  );
}
