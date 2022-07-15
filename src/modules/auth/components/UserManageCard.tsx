import BannedBadge from "@/common/components/badges/BannedBadge";
import RootBadge from "@/common/components/badges/RootBadge";
import StaffBadge from "@/common/components/badges/StaffBadge";
import { Tooltip } from "@nextui-org/react";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Lock, Shield, Slash, Unlock, X } from "react-feather";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  UserWithAdminUser,
  UserWithBansAndAdminUser,
} from "../types/prisma/User";

export default function UserManageCard({
  image,
  createdAt,
  email,
  id,
  name,
  updatedAt,
  AdminUser,
  BannedUser,
}: UserWithBansAndAdminUser) {
  const session = useSession();
  const queryClient = useQueryClient();

  const banMut = useMutation(async () => {
    await fetch(`/api/v1/users/action`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        action: "BAN",
      }),
    });
    return await queryClient.invalidateQueries("users");
  });

  const unbanMut = useMutation(async () => {
    await fetch(`/api/v1/users/action`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        action: "UNBAN",
      }),
    });
    return await queryClient.invalidateQueries("users");
  });

  if (session.status === "loading") return <div>Loading...</div>;

  if (session.status === "unauthenticated")
    return <div>This shouldn&apos;t ever be seen!</div>;

  // Type safety
  if (!session.data?.admin) return <div>This shouldn&apos;t ever be seen!</div>;

  const isRoot = session.data?.admin.permissions.includes("ROOT");

  return (
    <div className="card bg-base-300 w-80 md:w-96">
      <figure className="relative">
        <Image
          src="/static/img/missingno.png"
          alt="Gray banner placeholder (missingno)"
          layout="fixed"
          width={500}
          height={170}
        />
        <div className="absolute -bottom-10 left-5">
          <Image
            src={image || "https://cdn.discordapp.com/embed/avatars/0.png"}
            alt="User"
            layout="fixed"
            width={80}
            height={80}
            className="rounded-full !border-base-300 !border-8 !border-solid"
          />
        </div>
      </figure>
      <div className="card-body mt-2">
        <h2 className="card-title">
          {name}{" "}
          <div className="flex flex-row flex-wrap gap-2">
            {AdminUser ? <StaffBadge /> : null}{" "}
            {AdminUser?.permissions.includes("ROOT") ? <RootBadge /> : null}
            {BannedUser.length ? <BannedBadge /> : null}
          </div>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-primary block">User ID</span>
            <span className="break-words">{id}</span>
          </div>
          <div>
            <span className="text-primary block">User Email</span>
            <span className="break-words">{email}</span>
          </div>
          <div>
            <Tooltip content="Refers to when they first logged in to this website, not Discord account creation">
              <span className="text-primary">User Created</span>
            </Tooltip>
            <Tooltip
              content={`${new Date(createdAt).toLocaleDateString()} ${new Date(
                createdAt
              ).toLocaleTimeString()} Local Time`}
            >
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </Tooltip>
          </div>
          <div className="card-actions">
            {/* {isRoot && !BannedUser.length ? (
              <label className="btn btn-error" htmlFor={`${id}-ban-modal`}>
                <Lock />
                <span className="ml-1">Ban</span>
              </label>
            ) : AdminUser && isRoot ? null : (
              <label className="btn btn-success" htmlFor={`${id}-unban-modal`}>
                <Unlock />
                <span className="ml-1">Unban</span>
              </label>
            )}

            {isRoot && BannedUser.length ? (
              <label className="btn btn-success" htmlFor={`${id}-unban-modal`}>
                <Unlock />
                <span className="ml-1">Unban</span>
              </label>
            ) : null} */}
            {!BannedUser.length ? (
              isRoot ? (
                <label className="btn btn-error" htmlFor={`${id}-ban-modal`}>
                  <Lock />
                  <span className="ml-1">Ban</span>
                </label>
              ) : AdminUser ? null : (
                <label className="btn btn-success" htmlFor={`${id}-ban-modal`}>
                  <Unlock />
                  <span className="ml-1">Ban</span>
                </label>
              )
            ) : (
              <label className="btn btn-success" htmlFor={`${id}-unban-modal`}>
                <Unlock />
                <span className="ml-1">Unban</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* == MODALS == */}

      {/* Confim Ban Modal */}
      <>
        <input
          type="checkbox"
          id={`${id}-ban-modal`}
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              <span className="mr-1">Are you sure you want to ban {name}?</span>{" "}
              {AdminUser ? <StaffBadge /> : null}
            </h3>
            <p className="py-3">
              This user will be unable to access reports &amp; other functions!{" "}
              {AdminUser ? (
                <strong>This person is also in the staff team!</strong>
              ) : null}
            </p>
            <div className="modal-action">
              <label htmlFor={`${id}-ban-modal`} className="btn">
                <X />
                Cancel
              </label>
              <label
                htmlFor={`${id}-ban-modal`}
                className="btn btn-error"
                onClick={() => {
                  toast.promise(banMut.mutateAsync(), {
                    error: `Failed to ban ${name}`,
                    success: `Banned ${name}`,
                    pending: `Banning ${name}...`,
                  });
                }}
              >
                <Lock className="mr-1" />
                Ban
              </label>
            </div>
          </div>
        </div>
      </>

      {/* Unban Modal */}
      <>
        <input
          type="checkbox"
          id={`${id}-unban-modal`}
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to unban {name}?
            </h3>
            <p className="py-3">
              {id === "62cd8df27f5f718a7a5cdf56" ? (
                <span>
                  Don&apos;t do this buddy! You know he&apos;s a wanted
                  criminal!{" "}
                </span>
              ) : null}
              This action will unban this user
            </p>
            <div className="modal-action">
              <label htmlFor={`${id}-unban-modal`} className="btn">
                <X />
                Cancel
              </label>
              <label
                htmlFor={`${id}-unban-modal`}
                className="btn btn-success"
                onClick={() => {
                  toast.promise(unbanMut.mutateAsync(), {
                    error: `Failed to unban ${name}`,
                    success: `Unbanned ${name}`,
                    pending: `Unbanning ${name}...`,
                  });
                }}
              >
                <Unlock />
                Unban
              </label>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
