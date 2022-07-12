import checkPerms from "@/modules/auth/permissions/functions/checkPerms";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { ReactNode } from "react";
import { FilePlus, Flag, Monitor, Slash, Users } from "react-feather";

export default function DrawerLayout({ children }: React.PropsWithChildren) {
  const session = useSession();

  if (session.status === "loading")
    return (
      <div className="flex flex-col justify-center items-center text-center">
        <span className="text-xl loading">Loading</span>
      </div>
    );

  if (session.status === "unauthenticated")
    return (
      <div className="flex flex-col justify-center items-center text-center">
        <span className="text-xl loading">
          You&apos;re not logged in. Please log in to continue.
        </span>
      </div>
    );

  if (!session.data?.admin)
    return (
      <div className="flex flex-col justify-center items-center text-center">
        <span className="text-xl loading">
          You don&apos;t have permission to access this page.
        </span>
      </div>
    );

  return (
    <div className="drawer drawer-mobile">
      <input type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        {/* Page content */}
        {children}
      </div>
      <div className="drawer-side">
        <div className="drawer-overlay" />

        <div className="bg-base-200 pt-4 px-2">
          <DashboardButton name="" text="Overview" icon={<Monitor />} />
          {checkPerms(
            ["MANAGE_SERVERS", "MANAGE_ALL_SERVERS"],
            session as any
          ) ? (
            <>
              <span className="ml-1 mt-2 uppercase text-xs text-base-content font-bold">
                Servers
              </span>
              <DashboardButton
                name="add"
                text="Add Server"
                icon={<FilePlus />}
              />
            </>
          ) : null}
          {checkPerms(["MANAGE_REPORTS"], session as any) ? (
            <DashboardButton name="reports" text="Reports" icon={<Flag />} />
          ) : null}

          {checkPerms(["MODERATE_MEMBERS", "ADMIN"], session as any) ? (
            <>
              <span className="ml-1 mt-2 uppercase text-xs text-base-content font-bold">
                Users
              </span>
              <DashboardButton name="users" text="Users" icon={<Users />} />
              <DashboardButton name="bans" text="Bans" icon={<Slash />} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DashboardButton({
  name,
  icon,
  text,
}: {
  name: string;
  icon: ReactNode;
  text: string;
}) {
  return (
    <Link href={`/admin/${name}`} className="inline">
      <div className="block px-2 hover:bg-slate-500 rounded-md transition-colors cursor-pointer m-4">
        <div className="mask mask-squircle bg-slate-500 inline-block p-1 align-middle">
          {icon}
        </div>
        <span className="inline-block align-middle ml-2">{text}</span>
      </div>
    </Link>
  );
}
