import NSFWBadge from "@/common/components/badges/NSFWBadge";
import { ScamServer } from "@prisma/client";
import Link from "next/link";
import CardBottomAction from "../actions/CardBottomAction";
import BaseScamGuildCard from "./BaseScamGuildCard";

export function ViewReportScamGuildCard({ ...server }: ScamServer) {
  return (
    <BaseScamGuildCard server={server}>
      <Link href={`/servers/${server.id}`} passHref replace>
        <a>
          <CardBottomAction>
            <span className="font-semibold">
              <span className="inline-block align-middle">View Report</span>
              {server.nsfw ? <NSFWBadge /> : null}
            </span>
          </CardBottomAction>
        </a>
      </Link>
    </BaseScamGuildCard>
  );
}
