import NSFWBadge from "@/common/components/badges/NSFWBadge";
import ServerTypeTranslation from "@/modules/translation/enum/ServerType";
import verificationTooltips from "@/modules/translation/object/VerificationTooltips";
import { Tooltip } from "@nextui-org/react";
import {
  AdminUser,
  Prisma,
  ScamServer,
  ServerReport,
  User,
} from "@prisma/client";
import { GuildVerificationLevel } from "discord-api-types/v10";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Delete,
  Edit,
  Edit2,
  Info,
  Save,
  Slash,
  Trash2,
  X,
} from "react-feather";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

export default function ReportServerManageCard({
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
  createdByUser,
  longReport,
  evidenceLinks,
  adminIds,
}: ServerReport & {
  createdByUser: User;
}) {
  const rejectMut = useMutation(({ id }: { id: string }) => {
    return fetch("/api/v1/reports/action", {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    }).then((res) => {
      if (res.ok) return;
      throw new Error(res.statusText);
    });
  });

  const approveMut = useMutation(({ id }: { id: string }) => {
    return fetch("/api/v1/reports/action", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
  });

  const client = useQueryClient();

  let size: string;
  if (memberCount < 500) size = "Tiny";
  else if (memberCount > 500 && memberCount < 1000) size = "Small";
  else if (memberCount > 1000 && memberCount < 10000) size = "Medium";
  else if (memberCount > 10000 && memberCount < 100000) size = "Large";
  else if (memberCount > 100000) size = "Ginormous";
  else size = "Unknown";

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
          {name} {nsfw ? <NSFWBadge /> : null}
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
              content={
                verificationTooltips[
                  verificationLevel as GuildVerificationLevel
                ]
              }
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
        </div>
      </div>
      <div className="card-actions justify-end mr-2 mb-2">
        <label className="btn btn-primary modal-button" htmlFor={`${id}-info`}>
          <Info />
          <span className="ml-1">Info</span>
        </label>
        <label
          className="btn btn-success modal-button"
          htmlFor={`${id}-approve`}
        >
          <Check />
          <span className="ml-1">Approve</span>
        </label>
        <label className="btn btn-error modal-button" htmlFor={`${id}-modal`}>
          <Slash />
          <span className="ml-1">Reject</span>
        </label>
      </div>

      {/* Info Modal */}
      <>
        <input type="checkbox" className="modal-toggle" id={`${id}-info`} />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Information about report on {name}
            </h3>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Tooltip content="User-submitted description of the scam server. Markdown not rendered">
                    <span className="text-primary">Long Report</span>
                  </Tooltip>
                  <span>{longReport || "No long report submitted"}</span>
                </div>
                <div>
                  <Tooltip content="List of Admin/Owner IDs submitted by the reporter">
                    <span className="text-primary">Admin IDs</span>
                  </Tooltip>
                  {adminIds.length ? (
                    <span>{adminIds.join(", ")}</span>
                  ) : (
                    <span>No IDs submitted</span>
                  )}
                </div>
                <div>
                  <Tooltip content="List of evidence links submitted by the reporter">
                    <span className="text-primary">Evidence Links</span>
                  </Tooltip>
                  {evidenceLinks.length ? (
                    <span>{evidenceLinks.join(", ")}</span>
                  ) : (
                    <span>No evidence links submitted</span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-action">
              <label htmlFor={`${id}-info`} className="btn">
                <X />
                <span className="ml-1">Close</span>
              </label>
            </div>
          </div>
        </div>
      </>

      {/* Approve Modal */}
      <>
        <input type="checkbox" className="modal-toggle" id={`${id}-approve`} />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to approve {name}?
            </h3>
            <p className="py-4">This action is irreversible!</p>
            <div className="modal-action">
              <label htmlFor={`${id}-approve`} className="btn">
                <X />
                <span className="ml-1">Cancel</span>
              </label>
              <label
                htmlFor={`${id}-approve`}
                className="btn btn-success"
                onClick={() => {
                  toast
                    .promise(approveMut.mutateAsync({ id }), {
                      pending: "Approving...",
                      success: `Approved ${name}`,
                      error: `Failed to approve ${name}`,
                    })
                    .then(() => {
                      client.invalidateQueries("reportsName");
                    });
                }}
              >
                <Check />
                <span className="ml-1">Approve</span>
              </label>
            </div>
          </div>
        </div>
      </>

      {/* Reject Modal */}
      <>
        <input type="checkbox" id={`${id}-modal`} className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to reject {name}?
            </h3>
            <p className="py-4">This action is irreversible!</p>
            <div className="modal-action">
              <label
                htmlFor={`${id}-modal`}
                className="btn btn-error"
                onClick={() => {
                  toast
                    .promise(rejectMut.mutateAsync({ id }), {
                      pending: `Rejecting ${name}...`,
                      error: `Failed to reject ${name}`,
                      success: `Rejected ${name}`,
                    })
                    .then(() => {
                      client.invalidateQueries("reportsName");
                    });
                }}
              >
                <Slash className="align-middle" />
                <span className="align-middle ml-1">Reject</span>
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
