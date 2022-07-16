import ServerTypeTranslation from "@/modules/translation/enum/ServerType";
import verificationTooltips from "@/modules/translation/object/VerificationTooltips";
import { Tooltip } from "@nextui-org/react";
import { ScamServer } from "@prisma/client";
import { GuildVerificationLevel } from "discord-api-types/v10";
import Image from "next/image";
import Link from "next/link";

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
}: ScamServer) {
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
    <div className="card card-compact w-72 md:w-80 xl:w-96 rounded-md bg-base-300 flex">
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
        <h2 className="card-title">{name}</h2>
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
        </div>
      </div>
    </div>
  );
}
