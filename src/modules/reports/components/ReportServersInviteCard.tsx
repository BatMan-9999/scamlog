import verificationTooltips from "@/modules/translation/object/VerificationTooltips";
import { Tooltip } from "@nextui-org/react";
import { APIInvite, GuildVerificationLevel } from "discord-api-types/v10";
import Image from "next/image";

export default function ReportServersInviteCard({
  invite,
}: {
  invite: APIInvite;
}) {
  return (
    <div className="card card-compact w-80 md:w-96 rounded-md bg-base-300 block">
      <figure className="relative">
        {invite.guild?.banner ? (
          <Image
            src={`https://cdn.discordapp.com/banners/${invite.guild.id}/${invite.guild?.banner}?size=2048`}
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
              src={`https://cdn.discordapp.com/icons/${invite.guild?.id}/${invite.guild?.icon}?size=512`}
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
        <h2 className="card-title">{invite.guild?.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-primary">Server ID</span>
            <span>{invite.guild?.id}</span>
          </div>
          <div>
            <Tooltip
              content={"Approximate member count, which may not be accurate."}
            >
              <span className="block text-primary">Member Count</span>
            </Tooltip>
            <span className="">
              {invite.approximate_member_count?.toLocaleString() ?? "Unknown"}{" "}
            </span>
          </div>
          <div>
            <Tooltip content="Approximate online members, which may not be accurate.">
              <span className="block text-primary">Online Members</span>
            </Tooltip>
            <span className="">
              {invite.approximate_presence_count?.toLocaleString() ?? "Unknown"}{" "}
            </span>
          </div>
          <div>
            <span className="block text-primary">Verification Level</span>
            <Tooltip
              content={
                verificationTooltips[invite.guild?.verification_level ?? 0]
              }
            >
              <span className="">
                {GuildVerificationLevel[
                  invite.guild?.verification_level ?? 0
                ] ?? "Unknown"}{" "}
              </span>
            </Tooltip>
          </div>
          <div>
            <span className="block text-primary">Community Description</span>
            <span className="">
              {invite.guild?.description ?? "No description set"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
