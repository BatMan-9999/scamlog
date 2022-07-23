import PartneredBadge from "@/common/components/badges/PartneredBadge";
import { MovementGuild } from "@prisma/client";
import { Link } from "react-feather";
import CardBottomAction from "../actions/CardBottomAction";
import BaseGuildCard from "../BaseGuildCard";
import CardPropertiesGrid from "../properties/CardPropertiesGrid";
import CardProperty from "../properties/CardProperty";

export default function MovementGuildCard({
  movementGuild: {
    bannerHash,
    iconHash,
    name,
    url,
    serverId,
    description,
    partnered,
  },
}: MovementGuildCardProps) {
  return (
    <BaseGuildCard
      name={name}
      serverId={serverId}
      bannerHash={bannerHash}
      iconHash={iconHash}
      outerChildren={
        <a rel="noreferrer" target={"_blank"} href={url}>
          <CardBottomAction>
            <Link />
            <span className="ml-1">Join Server</span>
          </CardBottomAction>
        </a>
      }
    >
      <CardPropertiesGrid>
        <CardProperty name="Server Description">{description}</CardProperty>
        <CardProperty name="Badges">
          {partnered ? <PartneredBadge /> : null}
        </CardProperty>
      </CardPropertiesGrid>
    </BaseGuildCard>
  );
}

export interface MovementGuildCardProps {
  movementGuild: MovementGuild;
}
