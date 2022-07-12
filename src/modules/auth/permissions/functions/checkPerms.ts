import { UserPermissions } from "@prisma/client";
import { Session } from "next-auth";
import { SessionContextValue, useSession } from "next-auth/react";

/**
 * Check if a user has certain perms
 * @param perms Any permissions in this array will return true
 * @param session The session object
 */
export default function checkPerms(
  perms: UserPermissions[],
  session: { data: Session }
): boolean {
  if (!session.data.admin) return false;
  if (session.data.admin.permissions.includes("ROOT")) return true;
  for (const permission of session.data.admin.permissions) {
    if (perms.includes(permission)) return true;
  }
  return false;
}
