import { ScamServer } from "@prisma/client";
import { useInfiniteQuery } from "react-query";
import { useState } from "react";
import { ViewReportScamGuildCard } from "@/modules/cards/guilds/ViewReportScamGuildCard";
import FlexCenter from "@/common/components/base/flex/FlexCenter";
import FlexGrid from "@/common/components/base/flex/FlexGrid";
import InfiniteScroll from "react-infinite-scroller";
import useDebounce from "@/common/hooks/useDebounce";

export default function Index() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const fetchScamServer = ({ pageParam }: { pageParam?: string }) =>
    fetch(
      `/api/v1/servers${
        pageParam ? `?cursor=${pageParam}&` : "?"
      }name=${search}`
    ).then((res) => res.json());

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery(
    ["scamservers", debouncedSearch],
    fetchScamServer,
    {
      getNextPageParam: (lastPage) => lastPage?.data?.cursor ?? null,
    }
  );
  return (
    <>
      <FlexCenter>
        <div className="form-input mx-2 md:mx-6 my-4">
          <input
            type="text"
            placeholder="Search Name..."
            className="input input-bordered w-72 md:w-96"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </FlexCenter>
      <InfiniteScroll
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        loader={<div>Loading...</div>}
      >
        <FlexCenter>
          <FlexGrid>
            {data?.pages.map((page) =>
              page?.data?.servers
                ?.filter((s: ScamServer) => s.isActive)
                ?.map?.((server: ScamServer) => (
                  <ViewReportScamGuildCard key={server.id} {...server} />
                ))
            )}
          </FlexGrid>
        </FlexCenter>
      </InfiniteScroll>
    </>
  );
}
