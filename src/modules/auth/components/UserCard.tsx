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
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <span className="text-sm">{user.id}</span>
        </div>
      </div>
    </div>
  );
}
