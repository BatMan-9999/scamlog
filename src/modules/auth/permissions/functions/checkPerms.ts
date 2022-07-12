import { UserPermissions } from "@prisma/client";
import { Session } from "next-auth";

/**
 * Check if a user has certain perms
 * @param perms Any permissions in this array will return true
 * @param session The session object
 */
export default function checkPerms(
  perms: UserPermissions[],
  session: Session
): boolean {
  if (!session.admin) return false;
  if (session.admin.permissions.includes("ROOT")) return true;
  for (const permission of session.admin.permissions) {
    if (perms.includes(permission)) return true;
  }
  return false;
}
