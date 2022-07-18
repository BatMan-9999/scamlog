import { UserWithBansAndAdminUser } from "@/modules/auth/types/prisma/User";
import BaseModal from "@/modules/modals/base/BaseModal";
import BaseModalActions from "@/modules/modals/base/BaseModalAction";
import { Slash, UserCheck } from "react-feather";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import CardBottomAction from "../actions/CardBottomAction";
import BaseUserCard from "../BaseUserCard";
import CardPropertiesGrid from "../properties/CardPropertiesGrid";
import CardProperty from "../properties/CardProperty";

export default function UserManageCard({
  AdminUser,
  BannedUser,
  email,
  id,
  name,
  image,
}: UserWithBansAndAdminUser) {
  const queryClient = useQueryClient();

  const banMut = useMutation(() => {
    return fetch(`/api/v1/users/action`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        action: "BAN",
        id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => queryClient.invalidateQueries("users"));
  });

  const unbanMut = useMutation(() => {
    return fetch(`/api/v1/users/action`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        action: "UNBAN",
        id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => queryClient.invalidateQueries("users"));
  });

  return (
    <>
      <BaseUserCard
        name={name}
        pfp={image}
        AdminUser={AdminUser}
        BannedUser={BannedUser}
        outerChildren={
          <>
            {BannedUser ? (
              <label htmlFor={`${id}-unban-modal`}>
                <CardBottomAction color="bg-success hover:bg-green-500 text-base-100">
                  <UserCheck />
                  Unban
                </CardBottomAction>
              </label>
            ) : (
              <label htmlFor={`${id}-ban-modal`}>
                <CardBottomAction color="bg-error hover:bg-red-500">
                  <Slash />
                  Ban
                </CardBottomAction>
              </label>
            )}
          </>
        }
      >
        <CardPropertiesGrid>
          <CardProperty
            name="Database ID"
            tooltip="Internal database ID for this user"
          >
            <span className="break-words">{id}</span>
          </CardProperty>
          <CardProperty name="Email Address">
            <span className="break-words">{email}</span>
          </CardProperty>
        </CardPropertiesGrid>
      </BaseUserCard>

      {/* Modals */}

      {/* Ban Confirm Modal */}
      <BaseModal
        title={`Are you sure you want to ban ${name}?`}
        id={`${id}-ban-modal`}
      >
        <p className="py-2">
          This user will be unable to access reporting until they are unbanned
        </p>
        <BaseModalActions id={`${id}-ban-modal`}>
          <label
            htmlFor={`${id}-ban-modal`}
            className="btn btn-error"
            onClick={() => {
              toast.promise(banMut.mutateAsync(), {
                error: `Error whilst banning ${name}`,
                success: `Successfully banned ${name}`,
                pending: `Banning ${name}...`,
              });
            }}
          >
            <Slash />
            <span className="ml-1">Ban</span>
          </label>
        </BaseModalActions>
      </BaseModal>

      {/* Unban Confirm Modal */}
      <BaseModal
        title={`Are you sure you want to unban ${name}?`}
        id={`${id}-unban-modal`}
      >
        <p className="py-2">
          This user will be unbanned, meaning they can access reporting again
        </p>
        <BaseModalActions id={`${id}-unban-modal`}>
          <label
            htmlFor={`${id}-unban-modal`}
            className="btn btn-success"
            onClick={() => {
              toast.promise(unbanMut.mutateAsync(), {
                error: `Error whilst unbanning ${name}`,
                success: `Successfully unbanned ${name}`,
                pending: `Unbanning ${name}...`,
              });
            }}
          >
            <UserCheck />
            <span className="ml-1">Unban</span>
          </label>
        </BaseModalActions>
      </BaseModal>
    </>
  );
}
