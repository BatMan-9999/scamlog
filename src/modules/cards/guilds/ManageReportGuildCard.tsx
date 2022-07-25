import FlexVertical from "@/common/components/base/flex/FlexVertical";
import { GuildReportWithCreatedByUser } from "@/common/types/prisma/GuildReport";
import BaseModal from "@/modules/modals/base/BaseModal";
import { Prisma, ServerReport } from "@prisma/client";
import { CheckCircle, Edit, Edit2, XCircle } from "react-feather";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import CardBottomAction from "../actions/CardBottomAction";
import BaseGuildCard from "../BaseGuildCard";
import CardPropertiesGrid from "../properties/CardPropertiesGrid";
import CardProperty from "../properties/CardProperty";

export default function ManageReportGuildCard({
  ...guild
}: GuildReportWithCreatedByUser) {
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
            <CardBottomAction>
              <FlexVertical>
                <Edit />
                <span className="font-semibold ml-1">Edit</span>
              </FlexVertical>
            </CardBottomAction>
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
            <span className="break break-words">{guild.longReport}</span>
          </CardProperty>
        </CardPropertiesGrid>
      </BaseGuildCard>

      {/* Modals */}
      <BaseModal
        id={`${guild.id}-reportedit-modal`}
        title={`Editing report for ${guild.name}`}
      ></BaseModal>
    </>
  );
}
