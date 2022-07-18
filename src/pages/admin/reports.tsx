import CardGrid from "@/common/components/base/grid/CardGrid";
import useDebounce from "@/common/hooks/useDebounce";
import DrawerLayout from "@/modules/dash/components/DrawerLayout";
import ReportServerManageCard from "@/modules/dash/components/ReportServersManageCard";
import { ScamServer, ServerReport } from "@prisma/client";
import { User } from "@prisma/client";
import { useState } from "react";
import { Search } from "react-feather";
import { QueryFunctionContext, useInfiniteQuery } from "react-query";

export default function Reports() {
  const [nameSearch, setNameSearch] = useState("");

  const debouncedNameSearch = useDebounce(nameSearch, 300);

  const fetchReports = (
    { pageParam }: QueryFunctionContext<string[], any>,
    searchQuery: string
  ) =>
    fetch(
      `/api/v1/reports${pageParam ? `?cursor=${pageParam}` : ""}${
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
    ["reportsName", debouncedNameSearch],
    (pageParam) => fetchReports(pageParam, debouncedNameSearch),
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
        <CardGrid>
          {data?.pages.map((page) =>
            page.data.servers.map(
              (
                report: ServerReport & {
                  createdByUser: User;
                }
              ) => <ReportServerManageCard key={report.id} {...report} />
            )
          )}
        </CardGrid>
      </div>
    </DrawerLayout>
  );
}
