import FlexCenter from "@/common/components/base/flex/FlexCenter";
import FlexVertical from "@/common/components/base/flex/FlexVertical";
import { ScamServerWithCreatedByUserAndApprovedBy } from "@/common/types/prisma/ScamServer";
import BaseModal from "@/modules/modals/base/BaseModal";
import BaseModalActions from "@/modules/modals/base/BaseModalAction";
import { Prisma, ServerType } from "@prisma/client";
import { useState } from "react";
import { Edit, Plus, Save, Trash2, X } from "react-feather";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import CardBottomAction from "../actions/CardBottomAction";
import CardProperty from "../properties/CardProperty";
import BaseScamGuildCard from "./BaseScamGuildCard";

export default function ManageScamGuildCard({
  ...server
}: ScamServerWithCreatedByUserAndApprovedBy) {
  // React State
  const [serverType, setServerType] = useState<ServerType>(server.serverType);
  const [longReport, setLongReport] = useState(server.longReport);
  const [inviteCodes, setInviteCodes] = useState(server.inviteCodes);
  const [currentInviteCode, setCurrentInviteCode] = useState("");
  const [nsfw, setNSFW] = useState(server.nsfw);
  const [adminIds, setAdminIds] = useState(server.adminIds);
  const [currentAdminId, setCurrentAdminId] = useState("");

  // React Query
  const queryClient = useQueryClient();

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
    }).then(() => queryClient.invalidateQueries("scamserversName"));
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
      }).then(() => queryClient.invalidateQueries("scamserversName"));
    }
  );

  return (
    <>
      <BaseScamGuildCard
        server={server}
        extraProps={
          <CardProperty name="Server Invites">
            {server.inviteCodes.map((i) => (
              <>
                <a
                  key={i}
                  href={`https://discord.gg/${i}`}
                  rel="noreferrer"
                  target={"_blank"}
                  className="link"
                >
                  {i}
                </a>{" "}
              </>
            ))}
          </CardProperty>
        }
      >
        <label htmlFor={`${server.id}-edit-modal`}>
          <CardBottomAction>
            <FlexVertical>
              <Edit />
              <span className="font-semibold ml-1">Edit</span>
            </FlexVertical>
          </CardBottomAction>
        </label>
        <label htmlFor={`${server.id}-delete-modal`}>
          <CardBottomAction color="bg-error hover:bg-red-500">
            <FlexVertical>
              <Trash2 />
              <span className="font-semibold ml-1">Delete</span>
            </FlexVertical>
          </CardBottomAction>
        </label>
      </BaseScamGuildCard>

      {/* Modals */}

      {/* Delete Modal */}
      <BaseModal
        id={`${server.id}-delete-modal`}
        title={`Are you sure you want to delete ${server.name}?`}
      >
        <p className="py-2">This action is irreversible!</p>
        <BaseModalActions id={`${server.id}-delete-modal`}>
          <label
            onClick={() => {
              toast.promise(deleteMut.mutateAsync({ id: server.id }), {
                pending: `Deleting ${server.name}...`,
                success: `Deleted ${server.name}!`,
                error: `Failed to delete ${server.name}!`,
              });
            }}
            htmlFor={`${server.id}-delete-modal`}
            className="btn btn-error"
          >
            <Trash2 />
            <span className="font-semibold ml-1">Delete</span>
          </label>
        </BaseModalActions>
      </BaseModal>

      {/* Edit Modal */}
      <BaseModal
        id={`${server.id}-edit-modal`}
        title={`Editing ${server.name}`}
      >
        <div className="form-control">
          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Scam Type</span>
                <span className="label-text-alt">
                  {serverType === "OTHER"
                    ? "Specify the type of server in the description"
                    : null}
                </span>
              </label>

              <select
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setServerType(e.target.value as ServerType)}
                value={serverType}
              >
                <option disabled>Select a type</option>
                <option value="QR">QR</option>
                <option value="FAKENITRO">Fake Nitro</option>
                <option value="OAUTH">OAuth/Forced Join</option>
                <option value="VIRUS">Malware &amp; Viruses</option>
                <option value="NSFW">Nudes &amp; NSFW Scams</option>
                <option value="SPAM">Mass DMs, Spam &amp; Ads</option>
                <option value="OTHER">Other...</option>
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Server Invite</span>
              </label>
              <label className="input-group">
                <span>.gg/</span>
                <input
                  type="text"
                  value={currentInviteCode}
                  onChange={(e) => setCurrentInviteCode(e.target.value)}
                  className="input input-bordered w-full"
                />
                <button
                  className="btn btn-square btn-primary"
                  onClick={(e) => {
                    if (currentInviteCode === "")
                      return toast("Please enter an invite code", {
                        type: "error",
                      });

                    if (inviteCodes.includes(currentInviteCode))
                      return toast("Invite code already exists", {
                        type: "error",
                      });

                    setInviteCodes([...inviteCodes, currentInviteCode.trim()]);
                  }}
                >
                  <Plus />
                </button>
              </label>
              <FlexCenter>
                <div className="flex flex-col w-max justify-center items-center mt-3 gap-2">
                  {inviteCodes.map((i) => (
                    <div key={i} className="p-2 border relative">
                      <div
                        className="absolute -top-2 -right-2 bg-error hover:bg-red-500 rounded-full"
                        onClick={() => {
                          setInviteCodes(inviteCodes.filter((ic) => ic !== i));
                        }}
                      >
                        <X />
                      </div>
                      <FlexCenter>
                        <span className="text-center">{i}</span>
                      </FlexCenter>
                    </div>
                  ))}
                </div>
              </FlexCenter>
            </div>
          </div>
          <div className="mt-4">
            <label className="label">
              <span className="label-text">Long Report</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-72"
              onChange={(e) => setLongReport(e.target.value)}
              value={longReport ?? ""}
              placeholder="Markdown **supported**"
            />
          </div>
          <div className="mt-4">
            <label className="label cursor-pointer">
              <span className="label-text">NSFW</span>
              <input
                type="checkbox"
                className="checkbox checkbox-md"
                checked={nsfw}
                onChange={(e) => setNSFW(e.target.checked)}
              />
            </label>
            <div className="mt-4">
              <label className="label">
                <span className="label-text">Admin IDs</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  value={currentAdminId}
                  onChange={(e) => setCurrentAdminId(e.target.value)}
                  className="input input-bordered w-full"
                />
                <button
                  className="btn btn-square btn-primary"
                  onClick={(e) => {
                    if (currentAdminId === "")
                      return toast("Please enter an admin ID", {
                        type: "error",
                      });

                    if (adminIds.includes(currentAdminId))
                      return toast("Admin ID already exists", {
                        type: "error",
                      });

                    setAdminIds([...adminIds, currentAdminId.trim()]);
                  }}
                >
                  <Plus />
                </button>
              </label>
              <FlexCenter>
                <div className="flex flex-col w-max justify-center items-center mt-3 gap-2">
                  {adminIds.map((i) => (
                    <div key={i} className="p-2 border relative">
                      <div
                        className="absolute -top-2 -right-2 bg-error hover:bg-red-500 rounded-full"
                        onClick={() => {
                          setAdminIds(adminIds.filter((id) => id !== i));
                        }}
                      >
                        <X />
                      </div>
                      <FlexCenter>
                        <span className="text-center">{i}</span>
                      </FlexCenter>
                    </div>
                  ))}
                </div>
              </FlexCenter>
            </div>
          </div>
        </div>
        <BaseModalActions
          id={`${server.id}-edit-modal`}
          close="Cancel"
          onCancel={() => {
            // Reset state
            setCurrentInviteCode("");
            setInviteCodes(server.inviteCodes);
            setServerType(server.serverType);
            setNSFW(server.nsfw);
            setLongReport(server.longReport);
          }}
        >
          <label
            onClick={() => {
              toast.promise(
                updateMut.mutateAsync({
                  id: server.id,
                  inviteCodes,
                  serverType,
                  nsfw,
                  longReport,
                }),
                {}
              );
            }}
            htmlFor={`${server.id}-edit-modal`}
            className="btn btn-primary"
          >
            <Save />
            <span className="font-semibold ml-1">Save</span>
          </label>
        </BaseModalActions>
      </BaseModal>
    </>
  );
}
