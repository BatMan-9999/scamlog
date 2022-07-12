import { Tooltip } from "@nextui-org/react";
import { ScamServer } from "@prisma/client";
import { GuildVerificationLevel } from "discord-api-types/v10";
import Image from "next/image";

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
}: ScamServer) {
  let size: string;
  if (memberCount < 500) size = "Tiny";
  else if (memberCount > 500 && memberCount < 1000) size = "Small";
  else if (memberCount > 1000 && memberCount < 10000) size = "Medium";
  else if (memberCount > 10000 && memberCount < 100000) size = "Large";
  else if (memberCount > 100000) size = "Ginormous";
  else size = "Unknown";

  const verificationTooltips: Record<string, string> = {
    "0": "Unrestricted",
    "1": "Must have a verified email on their Discord account.",
    "2": "Must be registered on Discord for longer than 5 minutes.",
    "3": "Must be a member of the server for longer than 10 minutes.",
    "4": "Must have a verified phone on their Discord account.",
  };

  const colours: Record<string, string> = {
    Tiny: "badge-success",
    Small: "badge-info",
    Medium: "badge-primary",
    Large: "badge-warning",
    Ginormous: "badge-outline badge-danger",
    Unknown: "badge-neutral",
  };

  return (
    // <div className="card card-compact w-80 md:w-96 rounded-md bg-base-300">
    //   <figure>
    //     {bannerHash ? (
    //       <Image
    //         src={`https://cdn.discordapp.com/banners/${serverId}/${bannerHash}?size=2048`}
    //         alt="Server banner"
    //         layout="fixed"
    //         width={500}
    //         height={170}
    //       />
    //     ) : null}
    //   </figure>
    //   <div className="card-body">
    //     <h2 className="card-title">{name}</h2>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    //       <div>
    //         <span className="block text-primary">Server ID</span>
    //         <span>{serverId}</span>
    //       </div>
    //       <div>
    //         <span className="block text-primary">Created At</span>
    //         <span>{new Date(createdAt).toLocaleDateString()} Local Time</span>
    //       </div>
    //       <div>
    //         <span className="block text-primary">Scam Type</span>
    //         <span className="capitalize">{serverType.toLowerCase()}</span>
    //       </div>
    //       <div>
    //         <span className="block text-primary">Member Count</span>
    //         <span className="">
    //           {memberCount.toLocaleString() ?? "Unknown"}{" "}
    //           <span className={`ml-1 badge ${colours[size]}`}>{size}</span>
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="card-actions bg-primary hover:bg-secondary transition-colors text-center cursor-pointer py-2 flex justify-center">
    //     <span className="font-semibold">View Report</span>
    //   </div>
    // </div>

    <div className="card card-compact w-80 md:w-96 rounded-md bg-base-300 flex">
      <figure className="relative">
        {bannerHash ? (
          nsfw ? (
            <Image
              src={`/static/img/nsfw.png`}
              alt="NSFW Server banner (censored)"
              layout="fixed"
              width={500}
              height={170}
            />
          ) : (
            <Image
              src={`https://cdn.discordapp.com/banners/${serverId}/${bannerHash}?size=2048`}
              alt="Server banner"
              layout="fixed"
              width={500}
              height={170}
            />
          )
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
              content={verificationTooltips[verificationLevel.toString()]}
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
        </div>
      </div>
      <div className="card-actions bg-primary hover:bg-secondary transition-colors text-center cursor-pointer py-2 flex justify-center self-end w-full">
        <span className="font-semibold">
          View Report {nsfw ? <span className="badge badge-warning ml-1">NSFW</span> : null}
        </span>
      </div>
    </div>
  );
}
