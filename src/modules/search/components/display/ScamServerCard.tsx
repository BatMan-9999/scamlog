import { ScamServer } from "@prisma/client";
import Image from "next/image";

export default function ScamServerCard({
  name,
  bannerHash,
  serverId,
  createdAt,
  serverType,
  memberCount,
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
    <div className="card card-compact w-80 md:w-96 rounded-md bg-base-300">
      <figure>
        {bannerHash ? (
          <Image
            src={`https://cdn.discordapp.com/banners/${serverId}/${bannerHash}?size=2048`}
            alt="Server banner"
            layout="fixed"
            width={500}
            height={170}
          />
        ) : null}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-primary">Server ID</span>
            <span>{serverId}</span>
          </div>
          <div>
            <span className="block text-primary">Created At</span>
            <span>{new Date(createdAt).toLocaleDateString()} Local Time</span>
          </div>
          <div>
            <span className="block text-primary">Scam Type</span>
            <span className="capitalize">{serverType.toLowerCase()}</span>
          </div>
          <div>
            <span className="block text-primary">Member Count</span>
            <span className="">
              {memberCount.toLocaleString() ?? "Unknown"}{" "}
              <span className={`ml-1 badge ${colours[size]}`}>{size}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="card-actions bg-primary hover:bg-secondary transition-colors text-center cursor-pointer py-2 flex justify-center">
        <span className="font-semibold">View Report</span>
      </div>
    </div>
  );
}
