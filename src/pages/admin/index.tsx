import DrawerLayout from "@/modules/dash/components/DrawerLayout";
import { useQuery } from "react-query";
import { File, Flag, Users } from "react-feather";

export default function Admin() {
  const serverCountQuery = useQuery("servercount", () =>
    fetch("/api/v1/servers/count").then((res) => res.json())
  );
  const reportsCountQuery = useQuery("reportscount", () =>
    fetch("/api/v1/reports/count").then((res) => res.json())
  );

  const sessionsCountQuery = useQuery("sessioncount", () =>
    fetch("/api/v1/sessions/count").then((res) => res.json())
  );

  return (
    <DrawerLayout>
      <div className="mx-4">
        <h2 className="text-xl font-semibold">Database Overview</h2>
        <div className="stats border mt-4  stats-vertical md:stats-horizontal ">
          <div className="stat">
            <div className="stat-figure text-primary">
              <File />
            </div>
            <div className="stat-title">Servers</div>
            <div className="stat-value">
              {serverCountQuery.status === "loading" ? (
                <div className="loading">Loading</div>
              ) : serverCountQuery.status === "error" ? (
                "Something went wrong!"
              ) : (
                serverCountQuery?.data?.data
              )}
            </div>
            <div className="stat-desc">Scam servers recorded in database</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-primary">
              <Flag />
            </div>
            <div className="stat-title">Reports</div>
            <div className="stat-value">
              {serverCountQuery.status === "loading" ? (
                <div className="loading">Loading</div>
              ) : serverCountQuery.status === "error" ? (
                "Something went wrong!"
              ) : (
                reportsCountQuery?.data?.data
              )}
            </div>
            <div className="stat-desc">User reports submitted</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users />
            </div>
            <div className="stat-title">Sessions</div>
            <div className="stat-value">
              {serverCountQuery.status === "loading" ? (
                <div className="loading">Loading</div>
              ) : serverCountQuery.status === "error" ? (
                "Something went wrong!"
              ) : (
                sessionsCountQuery?.data?.data
              )}
            </div>
            <div className="stat-desc">Active user sessions in the database</div>
          </div>
        </div>
      </div>
    </DrawerLayout>
  );
}
