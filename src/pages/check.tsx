import FlexCenter from "@/common/components/base/flex/FlexCenter";
import { useEffect, useState } from "react";
import { Search } from "react-feather";
import { useQuery } from "react-query";

export default function Check() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const inviteQuery = useQuery(["discordserver", query], {
    refetchOnWindowFocus: false,
    enabled: query.length > 0,
  });

  useEffect(() => {
    if (search.length === 0) setQuery("");
  }, [search, setQuery]);

  return (
    <FlexCenter>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="form-control mx-4 px-4 py-5 bg-white bg-opacity-5 mb-4"
      >
        <div className="w-full py-2">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Check Server Invite</h2>
            <span>
              Enter an invite below to check if it matches a scam server in our
              database

              WORK IN PROGRESS
            </span>
          </div>
          <FlexCenter>
            <div className="mt-4">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Invite Code"
                  className="input input-bordered"
                  onChange={(e) => setSearch(e.target.value)}
                  disabled
                />
                <button
                  className="btn btn-square btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setQuery(search);
                    inviteQuery.refetch();
                  }}
                >
                  <Search />
                </button>
              </div>
            </div>
          </FlexCenter>
        </div>
      </form>
    </FlexCenter>
  );
}
