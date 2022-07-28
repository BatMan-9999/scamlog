import FlexVertical from "@/common/components/base/flex/FlexVertical";
import { GuildReportWithCreatedByUser } from "@/common/types/prisma/GuildReport";
import BaseModal from "@/modules/modals/base/BaseModal";
import BaseModalActions from "@/modules/modals/base/BaseModalAction";
import ServerTypeTranslation from "@/modules/translation/enum/ServerType";
import { Prisma, ServerReport } from "@prisma/client";
import { useState } from "react";
import { CheckCircle, Edit, Plus, Save, XCircle } from "react-feather";
import List from "@/common/components/form/list";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import CardBottomAction from "../actions/CardBottomAction";
import BaseGuildCard from "../BaseGuildCard";
import CardPropertiesGrid from "../properties/CardPropertiesGrid";
import CardProperty from "../properties/CardProperty";
import FlexCenter from "@/common/components/base/flex/FlexCenter";

export default function ManageReportGuildCard({
  ...guild
}: GuildReportWithCreatedByUser) {
  // Form State
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [adminIds, setAdminIds] = useState<string[]>(guild.adminIds ?? []);
  const [currentInviteCode, setCurrentInviteCode] = useState("");
  const [inviteCodes, setInviteCodes] = useState(guild.inviteCodes);
  const [longReport, setLongReport] = useState(guild.longReport ?? "");
  const [serverType, setServerType] = useState(guild.serverType);
  const [nsfw, setNSFW] = useState(guild.nsfw ?? false);

  const queryClient = useQueryClient();

  const approveMut = useMutation(({ id }: { id: string }) =>
    fetch(`/api/v1/reports/action`, {
      credentials: "include",
      body: JSON.stringify({ id }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => queryClient.invalidateQueries("reportsName"))
  );

  const rejectMut = useMutation(({ id }: { id: string }) =>
    fetch(`/api/v1/reports/action`, {
      credentials: "include",
      body: JSON.stringify({ id }),
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => queryClient.invalidateQueries("reportsName"))
  );

  const patchMut = useMutation(
    ({ id, ...patch }: Prisma.ServerReportUpdateInput & { id: string }) =>
      fetch(`/api/v1/reports/action`, {
        credentials: "include",
        body: JSON.stringify({ id, ...patch }),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => queryClient.invalidateQueries("reportsName"))
  );

  return (
    <>
      <BaseGuildCard
        name={guild.name}
        serverId={guild.serverId}
        bannerHash={guild.bannerHash}
        iconHash={guild.iconHash}
        nsfw={guild.nsfw}
        outerChildren={
          <>
            <label htmlFor={`${guild.id}-reportedit-modal`}>
              <CardBottomAction>
                <FlexVertical>
                  <Edit />
                  <span className="font-semibold ml-1">Edit</span>
                </FlexVertical>
              </CardBottomAction>
            </label>
            <div
              onClick={(e) =>
                toast.promise(
                  rejectMut.mutateAsync({
                    id: guild.id,
                  }),
                  {
                    error: `Failed to reject ${guild.name}`,
                    success: `Rejected ${guild.name}`,
                    pending: `Rejecting ${guild.name}...`,
                  }
                )
              }
            >
              <CardBottomAction color="bg-error hover:bg-red-500">
                <FlexVertical>
                  <XCircle /> <span className="font-semibold ml-1">Reject</span>
                </FlexVertical>
              </CardBottomAction>
            </div>
            <div
              onClick={(e) =>
                toast.promise(
                  approveMut.mutateAsync({
                    id: guild.id,
                  }),
                  {
                    error: `Failed to approve ${guild.name}`,
                    success: `Approved ${guild.name}`,
                    pending: `Approving ${guild.name}...`,
                  }
                )
              }
            >
              <CardBottomAction color="bg-success hover:bg-emerald-500 text-base-100">
                <FlexVertical>
                  <CheckCircle />
                  <span className="font-semibold ml-1">Approve</span>
                </FlexVertical>
              </CardBottomAction>
            </div>
          </>
        }
      >
        <CardPropertiesGrid>
          <CardProperty name="Server ID">
            <span>{guild.serverId}</span>
          </CardProperty>
          <CardProperty name="Submitted" tooltip="Local Time">
            <span>{new Date(guild.createdAt).toLocaleString()}</span>
          </CardProperty>
          <CardProperty name="Submitted By">
            <span>{guild.createdByUser?.name}</span>
          </CardProperty>
          <CardProperty name="Server Description">
            <span>{guild.description ?? "No description set"}</span>
          </CardProperty>
          <CardProperty name="Description of Scam">
            <span className="break break-words">
              {guild.longReport || "No report supplied by user"}
            </span>
          </CardProperty>
          <CardProperty name="Admin IDs">
            {guild.adminIds.length ? (
              <span>{guild.adminIds.join(", ")}</span>
            ) : (
              "No Admin IDs supplied by user"
            )}
          </CardProperty>
          <CardProperty name="Evidence Links">
            {guild.evidenceLinks.length ? (
              <span>
                {guild.evidenceLinks.map((l) => (
                  <a
                    rel="noreferrer"
                    target={"_blank"}
                    href={l}
                    key={l}
                    className="link"
                  >
                    {l}
                  </a>
                ))}
              </span>
            ) : (
              "No evidence links supplied by the user"
            )}
          </CardProperty>
          <CardProperty name="Invite Codes">
            {guild.inviteCodes.length ? (
              <span>
                {guild.inviteCodes.map((l) => (
                  <a
                    rel="noreferrer"
                    target={"_blank"}
                    href={`https://discord.gg/${l}`}
                    key={l}
                    className="link"
                  >
                    discord.gg/{l}
                  </a>
                ))}
              </span>
            ) : (
              "No invite links supplied by user"
            )}
          </CardProperty>
          <CardProperty name="Scam Type">
            <span>{ServerTypeTranslation[guild.serverType]}</span>
          </CardProperty>
        </CardPropertiesGrid>
      </BaseGuildCard>

      {/* Modals */}
      <BaseModal
        id={`${guild.id}-reportedit-modal`}
        title={`Editing report for ${guild.name}`}
      >
        <div className="form-control">
          <FlexCenter>
            <FlexVertical>
              <div className="mt-4">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Admin ID"
                    className="input input-bordered"
                    value={currentAdminId}
                    onChange={(e) => setCurrentAdminId(e.target.value)}
                  />
                  <button
                    className="btn btn-square btn-primary"
                    onClick={() => {
                      if (!currentAdminId)
                        return toast.error("No Admin ID supplied");
                      setAdminIds([...adminIds, currentAdminId]);
                      setCurrentAdminId("");
                    }}
                  >
                    <Plus />
                  </button>
                </div>
                <List setter={setAdminIds} value={adminIds} />
                <div className="mt-4">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Invite Code"
                      className="input input-bordered"
                      value={currentInviteCode}
                      onChange={(e) => setCurrentInviteCode(e.target.value)}
                    />
                    <button
                      className="btn btn-square btn-primary"
                      onClick={() => {
                        if (!currentAdminId)
                          return toast.error("No Invite Code supplied");
                        setInviteCodes([...inviteCodes, currentInviteCode]);
                        setCurrentInviteCode("");
                      }}
                    >
                      <Plus />
                    </button>
                  </div>
                  <List setter={setInviteCodes} value={inviteCodes} />
                </div>
              </div>
            </FlexVertical>
          </FlexCenter>
        </div>
        <BaseModalActions
          id={`${guild.id}-reportedit-modal`}
          onCancel={() => {
            setCurrentAdminId("");
            setAdminIds(guild.adminIds);
            setServerType(guild.serverType);
            setLongReport(guild.longReport ?? "");
            setCurrentInviteCode("");
            setInviteCodes(guild.inviteCodes);
          }}
        >
          <label
            htmlFor={`${guild.id}-reportedit-modal`}
            onClick={() => {
              toast.promise(
                patchMut.mutateAsync({
                  id: guild.id,
                  longReport,
                  adminIds,
                  serverType,
                  inviteCodes,
                  nsfw,
                }),
                {
                  error: `Failed to edit ${guild.name}`,
                  success: `Edited ${guild.name}`,
                  pending: `Saving edits for ${guild.name}...`,
                }
              );
            }}
            className="btn btn-primary"
          >
            <Save />
            Save
          </label>
        </BaseModalActions>
      </BaseModal>
    </>
  );
}
