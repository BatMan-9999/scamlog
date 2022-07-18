import { PropsWithChildren, ReactNode } from "react";
import Image from "next/image";
import { AdminUser, BannedUser } from "@prisma/client";
import StaffBadge from "@/common/components/badges/StaffBadge";
import BannedBadge from "@/common/components/badges/BannedBadge";

export default function BaseUserCard({
  name,
  bannerHash,
  children,
  pfp,
  outerChildren,
  userId,
  AdminUser,
  BannedUser,
}: BaseUserCardProps & PropsWithChildren) {
  return (
    <div className="card w-72 md:w-80 xl:w-96 bg-base-300 flex">
      <figure className="relative">
        {/* User Banner Logic */}
        {bannerHash && userId ? (
          // bannerHash is defined
          <Image
            src={`https://cdn.discordapp.com/banners/${userId}/${bannerHash}?size=1024`}
            alt="User Banner"
            layout="fixed"
            width={500}
            height={170}
          />
        ) : (
          // bannerHash is undefined:
          <Image
            src={`/static/img/missingno.png`}
            alt="Missing user banner"
            layout="fixed"
            width={500}
            height={170}
          />
        )}

        {/* User Icon */}
        <div className="absolute -bottom-10 left-5">
          <Image
            src={pfp ?? "https://cdn.discordapp.com/embed/avatars/0.png"}
            alt="Server icon"
            layout="fixed"
            width={80}
            height={80}
            // Workarounds for circle around image
            className="rounded-full !border-base-300 !border-8 !border-solid bg-base-300"
          />
        </div>
      </figure>
      <div className="card-body">
        <h3 className="card-title">
          {name}
          {AdminUser ? <StaffBadge /> : null}
          {BannedUser ? <BannedBadge /> : null}
        </h3>
        {children}
      </div>
      {outerChildren ?? null}
    </div>
  );
}

export interface BaseUserCardProps {
  bannerHash?: string | null;
  userId?: string | null;
  name: string;
  pfp?: string | null;
  outerChildren?: ReactNode;
  AdminUser?: AdminUser | null;
  BannedUser?: BannedUser | null;
}
