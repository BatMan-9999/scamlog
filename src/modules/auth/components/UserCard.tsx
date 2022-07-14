import snowflake from "@/common/utilities/discord/snowflake";
import { Tooltip } from "@nextui-org/react";
import { User } from "@prisma/client";
import Image from "next/image";

export default function UserCard(user: User) {
  return (
    <div className="bg-base-300 p-2 not-prose rounded-md w-min">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col">
          <Image
            src={
              user.image + "?size=1024" ??
              "https://cdn.discordapp.com/embed/avatars/0.png"
            }
            alt="Profile picture"
            height={75}
            width={75}
            className="mask mask-circle"
            layout="fixed"
          />
        </div>
        <div className="">
          <h3 className="text-lg mt-1 font-semibold">{user.name}</h3>
          <span className="text-xs">{user.id}</span>
          <br />
          <Tooltip
            content={`${new Date(
              user.createdAt
            ).toLocaleDateString()} ${new Date(
              user.createdAt
            ).toLocaleTimeString()} Local Time`}
          >
            <span className="text-sm">
              Account Created {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
