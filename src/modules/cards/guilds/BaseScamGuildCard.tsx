import NSFWBadge from "@/common/components/badges/NSFWBadge";
import CardBottomAction from "@/modules/cards/actions/CardBottomAction";
import BaseGuildCard from "@/modules/cards/BaseGuildCard";
import CardPropertiesGrid from "@/modules/cards/properties/CardPropertiesGrid";
import CardProperty from "@/modules/cards/properties/CardProperty";
import ServerTypeTranslation from "@/modules/translation/enum/ServerType";
import verificationTooltips from "@/modules/translation/object/VerificationTooltips";
import { Tooltip } from "@nextui-org/react";
import { ScamServer } from "@prisma/client";
import { GuildVerificationLevel } from "discord-api-types/v10";
import Link from "next/link";
import guildSize, { guildSizeColor } from "@/utils/guildSize";
import { PropsWithChildren } from "react";

export default function BaseScamServerCard({
  server: {
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
  },
  children,
}: BaseScamGuildCardProps & PropsWithChildren) {
  const size = guildSize(memberCount);
  const badgeColour = guildSizeColor(size);

  const createdAtDate = new Date(createdAt);

  return (
    <BaseGuildCard
      name={name}
      bannerHash={bannerHash}
      iconHash={iconHash}
      serverId={serverId}
      nsfw={nsfw}
      outerChildren={children}
    >
      <CardPropertiesGrid>
        <CardProperty name="Server ID">
          <span>{serverId}</span>
        </CardProperty>
        <CardProperty
          name="Members"
          tooltip="Approximate amount. May not be accurate"
        >
          <span>{memberCount ? memberCount.toLocaleString() : "Unknown"}</span>
          <span className={`ml-1 badge ${badgeColour}`}>{size}</span>
        </CardProperty>
        <CardProperty
          name="Verification Level"
          tooltip="This means what requirements a users has to fulfill to participate in this server"
        >
          <Tooltip
            content={
              verificationTooltips[verificationLevel as GuildVerificationLevel]
            }
          >
            <span>
              {GuildVerificationLevel[verificationLevel] ?? "Unknown"}{" "}
            </span>
          </Tooltip>
        </CardProperty>
        <CardProperty
          name="Server Description"
          tooltip="This is set by the server owners"
        >
          <span>{description ?? "No description found"}</span>
        </CardProperty>
        <CardProperty name="Added to Database at">
          <span>{createdAtDate.toLocaleString()} Local Time</span>
        </CardProperty>
        <CardProperty
          name="Scam Type"
          tooltip="The type of scam this server is operating"
        >
          <span>{ServerTypeTranslation[serverType]}</span>
        </CardProperty>
        <CardProperty
          name="Database ID"
          tooltip="The internal ID used in the database"
        >
          <span>{id}</span>
        </CardProperty>
      </CardPropertiesGrid>
    </BaseGuildCard>
  );
}

export interface BaseScamGuildCardProps {
  server: ScamServer;
}
