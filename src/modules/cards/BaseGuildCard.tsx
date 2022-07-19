import { PropsWithChildren, ReactNode } from "react";
import Image from "next/image";
import NSFWBadge from "@/common/components/badges/NSFWBadge";

export default function BaseGuildCard({
  children,
  bannerHash,
  iconHash,
  name,
  serverId,
  outerChildren,
  nsfw,
}: BaseGuildCardProps & PropsWithChildren) {
  return (
    <div className="card card-compact w-72 md:w-80 xl:w-96 bg-base-300 flex">
      <figure className="relative">
        {/* Server Banner Logic */}
        {bannerHash ? (
          // bannerHash is defined
          nsfw !== undefined ? (
            // NSFW is defined:
            nsfw ? (
              // NSFW is true:
              <Image
                src={`/static/img/nsfw.png`}
                alt="NSFW Server banner (censored)"
                layout="fixed"
                width={500}
                height={170}
              />
            ) : (
              // NSFW is false:
              <Image
                src={`https://cdn.discordapp.com/banners/${serverId}/${bannerHash}?size=2048`}
                alt="Server banner"
                layout="fixed"
                width={500}
                height={170}
              />
            )
          ) : (
            // NSFW is undefined:
            <Image
              src={`https://cdn.discordapp.com/banners/${serverId}/${bannerHash}?size=2048`}
              alt="Server banner"
              layout="fixed"
              width={500}
              height={170}
            />
          )
        ) : (
          // bannerHash is undefined:
          <Image
            src={`/static/img/missingno.png`}
            alt="Missing server banner"
            layout="fixed"
            width={500}
            height={170}
          />
        )}

        {/* Server Icon */}
        <div className="absolute -bottom-10 left-5">
          {iconHash ? (
            nsfw !== undefined ? (
              nsfw ? (
                <Image
                  src={`/static/img/noimg.png`}
                  alt="Server icon"
                  layout="fixed"
                  width={80}
                  height={80}
                  // Workarounds for circle around image
                  // Shouldn't break with transparent images
                  className="rounded-full !border-base-300 !border-8 !border-solid !bg-base-300"
                />
              ) : (
                <Image
                  src={`https://cdn.discordapp.com/icons/${serverId}/${iconHash}?size=512`}
                  alt="Server icon"
                  layout="fixed"
                  width={80}
                  height={80}
                  // Workarounds for circle around image
                  // Shouldn't break with transparent images
                  className="rounded-full !border-base-300 !border-8 !border-solid !bg-base-300"
                />
              )
            ) : (
              <Image
                src={`https://cdn.discordapp.com/icons/${serverId}/${iconHash}?size=512`}
                alt="Server icon"
                layout="fixed"
                width={80}
                height={80}
                // Workarounds for circle around image
                // Shouldn't break with transparent images
                className="rounded-full !border-base-300 !border-8 !border-solid !bg-base-300"
              />
            )
          ) : (
            <Image
              src={`/static/img/noimg.png`}
              alt="Server icon"
              layout="fixed"
              width={80}
              height={80}
              // Workarounds for circle around image
              // Shouldn't break with transparent images
              className="rounded-full !border-base-300 !border-8 !border-solid !bg-base-300"
            />
          )}
        </div>
      </figure>
      <div className="card-body mt-8">
        <h3 className="card-title">
          {name} {nsfw ? <NSFWBadge /> : null}
        </h3>
        {children}
      </div>
      {outerChildren ?? null}
    </div>
  );
}

export interface BaseGuildCardProps {
  name: string;
  bannerHash?: string | null;
  serverId: string;
  iconHash?: string | null;
  outerChildren?: ReactNode;
  nsfw?: boolean;
}
