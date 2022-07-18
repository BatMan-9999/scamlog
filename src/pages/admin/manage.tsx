import FlexGrid from "@/common/components/base/flex/FlexGrid";
import useDebounce from "@/common/hooks/useDebounce";
import ManageScamGuildCard from "@/modules/cards/guilds/ManageScamGuildCard";
import DrawerLayout from "@/modules/dash/components/DrawerLayout";
import ManageScamServerCard from "@/modules/dash/components/ManageScamServerCard";
import { AdminUser, ScamServer, User } from "@prisma/client";
import { useState } from "react";
import { Search, Trash2, X } from "react-feather";
import { QueryFunctionContext, useInfiniteQuery } from "react-query";

export default function Manage() {
  const [nameSearch, setNameSearch] = useState("");

  const debouncedNameSearch = useDebounce(nameSearch, 300);

  const fetchScamServer = (
    { pageParam }: QueryFunctionContext<string[], any>,
    searchQuery: string
  ) =>
    fetch(
      `/api/v1/servers${pageParam ? `?cursor=${pageParam}` : ""}${
        pageParam ? "&" : "?"
      }name=${searchQuery}`
    ).then((res) => res.json());

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    ["scamserversName", debouncedNameSearch],
    (pageParam) => fetchScamServer(pageParam, debouncedNameSearch),
    {
      getNextPageParam: (lastPage) => lastPage?.data?.cursor ?? null,
      staleTime: 10_000,
      refetchInterval: 12_000,
    }
  );

  return (
    <DrawerLayout>
      <div className="flex flex-col mx-4 px-4 justify-center items-center mt-4">
        <div className="input-group flex justify-center items-center mb-4">
          <input
            type={"text"}
            className="input input-bordered w-full md:w-1/2"
            value={nameSearch}
            placeholder="Search by name"
            onChange={(e) => setNameSearch(e.target.value)}
          />
          <button
            className="btn btn-square btn-primary"
            disabled={!debouncedNameSearch}
          >
            <Search />
          </button>
        </div>
        <FlexGrid>
          {data?.pages.map((page) =>
            page.data.servers.map(
              (
                server: ScamServer & {
                  createdByUser: User;
                  approvedBy: AdminUser & {
                    user: User;
                  };
                }
              ) => <ManageScamGuildCard {...server} key={server.id} />
            )
          )}
        </FlexGrid>
        <div className="flex flex-col justify-center items-center">
          <button
            className={`btn btn-primary ${
              isFetchingNextPage || status === "loading" ? "loading" : ""
            }`}
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || !hasNextPage}
          >
            {isFetchingNextPage ? `Loading next page` : null}
            {status === "loading" ? "Loading" : null}
            {!hasNextPage ? "You've reached the end!" : null}
            {hasNextPage && status === "success" && !isFetching
              ? "Load more"
              : null}
          </button>
        </div>
      </div>
    </DrawerLayout>
  );
}
