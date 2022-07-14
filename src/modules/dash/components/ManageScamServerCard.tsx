import UserCard from "@/modules/auth/components/UserCard";
import ServerTypeTranslation from "@/modules/translation/enum/ServerType";
import { Tooltip } from "@nextui-org/react";
import { AdminUser, Prisma, ScamServer, User } from "@prisma/client";
import { GuildVerificationLevel } from "discord-api-types/v10";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Delete, Edit, Edit2, Save, Trash2, X } from "react-feather";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function ScamServerCard({
  name,
  bannerHash,
  serverId,
  createdAt,
  serverType,
  memberCount,
  iconHash,
  verificationLevel,
  description,
  nsfw,
  id,
  approvedBy,
  createdByUser,
  longReport,
}: ScamServer & {
  createdByUser: User;
  approvedBy: AdminUser & { user: User };
}) {
  const [newLongReport, setNewLongReport] = useState(longReport);

  const deleteMut = useMutation(({ id }: { id: string }) => {
    return fetch("/api/v1/servers/action", {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
  });

  const updateMut = useMutation(
    ({ id, ...rest }: { id: string } & Prisma.ScamServerUpdateInput) => {
      return fetch("/api/v1/servers/action", {
        credentials: "include",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...rest,
        }),
      });
    }
  );

  const client = useQueryClient();

  let size: string;
  if (memberCount < 500) size = "Tiny";
  else if (memberCount > 500 && memberCount < 1000) size = "Small";
  else if (memberCount > 1000 && memberCount < 10000) size = "Medium";
  else if (memberCount > 10000 && memberCount < 100000) size = "Large";
  else if (memberCount > 100000) size = "Ginormous";
  else size = "Unknown";

  const verificationTooltips: Record<string, string> = {
    "0": "Unrestricted",
    "1": "Must have a verified email on their Discord account.",
    "2": "Must be registered on Discord for longer than 5 minutes.",
    "3": "Must be a member of the server for longer than 10 minutes.",
    "4": "Must have a verified phone on their Discord account.",
  };

  const colours: Record<string, string> = {
    Tiny: "badge-success",
    Small: "badge-info",
    Medium: "badge-primary",
    Large: "badge-warning",
    Ginormous: "badge-outline badge-danger",
    Unknown: "badge-neutral",
  };

  return (
    <div className="card card-compact w-80 md:w-96 rounded-md bg-base-300 flex">
      <figure className="relative">
        {bannerHash ? (
          <Image
            src={`https://cdn.discordapp.com/banners/${serverId}/${bannerHash}?size=2048`}
            alt="Server banner"
            layout="fixed"
            width={500}
            height={170}
          />
        ) : (
          <Image
            src={`/static/img/missingno.png`}
            alt="Missing server banner"
            layout="fixed"
            width={500}
            height={170}
          />
        )}
        {
          <div className="absolute -bottom-10 left-5">
            <Image
              src={`https://cdn.discordapp.com/icons/${serverId}/${iconHash}?size=512`}
              alt="Server icon"
              layout="fixed"
              width={80}
              height={80}
              className="rounded-full !border-base-300 !border-8 !border-solid"
            />
          </div>
        }
      </figure>
      <div className="card-body mt-8">
        <h2 className="card-title">
          {name}{" "}
          {nsfw ? (
            <span className="badge badge-warning align-baseline">NSFW</span>
          ) : null}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-primary">Server ID</span>
            <span>{serverId}</span>
          </div>
          <div>
            <Tooltip
              content={"Approximate member count, which may not be accurate."}
            >
              <span className="block text-primary">Member Count</span>
            </Tooltip>
            <span className="">
              {memberCount.toLocaleString() ?? "Unknown"}{" "}
              <span className={`badge ${colours[size]}`}>{size}</span>
            </span>
          </div>
          <div>
            <span className="block text-primary">Verification Level</span>
            <Tooltip
              content={verificationTooltips[verificationLevel.toString()]}
            >
              <span className="">
                {GuildVerificationLevel[verificationLevel] ?? "Unknown"}{" "}
              </span>
            </Tooltip>
          </div>
          <div>
            <span className="block text-primary">Server Description</span>
            <span className="">{description ?? "No description set"}</span>
          </div>
          <div>
            <span className="block text-primary">Added to Database on</span>
            <Tooltip
              content={`${new Date(createdAt).toLocaleDateString()} ${new Date(
                createdAt
              ).toLocaleTimeString()} Local Time`}
            >
              <span className="">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </Tooltip>
          </div>
          <div>
            <span className="block text-primary">Scam Type</span>
            <span className="capitalize">
              {ServerTypeTranslation[serverType]}
            </span>
          </div>
          <div>
            <span className="block text-primary">Created By</span>
            <span>
              {createdByUser.name} ({createdByUser.id})
            </span>
          </div>
          <div>
            <span className="block text-primary">Approved By</span>
            <span>
              {approvedBy?.user ? (
                <span>
                  {approvedBy.user.name} ({approvedBy.userId})
                </span>
              ) : (
                <Tooltip content="This means this server was manually added by a staff member">
                  <span>No one</span>
                </Tooltip>
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="card-actions justify-end mr-2 mb-2">
        <label className="btn modal-button" htmlFor={`${id}-long-report-modal`}>
          <Edit />
          <span className="ml-1">Edit Long Report</span>
        </label>
        <label className="btn btn-error modal-button" htmlFor={`${id}-modal`}>
          <Trash2 />
          <span className="ml-1">Delete</span>
        </label>
      </div>
      {/* Edit Report Modal */}
      <>
        <input
          type="checkbox"
          id={`${id}-long-report-modal`}
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Editing Long Report for {name}
            </h3>
            <div className="form-control">
              <textarea
                className="textarea textarea-bordered"
                value={newLongReport ?? ""}
                onChange={(e) => setNewLongReport(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <label
                htmlFor={`${id}-long-report-modal`}
                className="btn btn-primary"
              >
                <Save className="align-middle" />
                <span
                  className="align-middle ml-1"
                  onClick={() => {
                    toast
                      .promise(updateMut.mutateAsync({ id, longReport: newLongReport }), {
                        pending: `Updating ${name}...`,
                        error: `Failed to update ${name}`,
                        success: `Updated ${name}`,
                      })
                      .then(() => {
                        client.invalidateQueries("scamserversName");
                      });
                  }}
                >
                  Save
                </span>
              </label>
              <label htmlFor={`${id}-long-report-modal`} className="btn">
                <X className="align-middle" />
                <span className="align-middle ml-1">Discard Changes</span>
              </label>
            </div>
          </div>
        </div>
      </>

      {/* Delete Modal */}
      <>
        <input type="checkbox" id={`${id}-modal`} className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete {name}?
            </h3>
            <p className="py-4">
              This action is irreversible! {name} will be{" "}
              <strong>deleted</strong> from the database{" "}
              <strong>forever</strong>!
            </p>
            <div className="modal-action">
              <label htmlFor={`${id}-modal`} className="btn btn-error">
                <Trash2 className="align-middle" />
                <span
                  className="align-middle ml-1"
                  onClick={() => {
                    toast
                      .promise(deleteMut.mutateAsync({ id }), {
                        pending: `Deleting ${name}...`,
                        error: `Failed to delete ${name}`,
                        success: `Deleted ${name}`,
                      })
                      .then(() => {
                        client.invalidateQueries("scamserversName");
                      });
                  }}
                >
                  Delete
                </span>
              </label>
              <label htmlFor={`${id}-modal`} className="btn">
                <X className="align-middle" />
                <span className="align-middle ml-1">Cancel</span>
              </label>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
