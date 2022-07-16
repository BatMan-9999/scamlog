import { PropsWithChildren } from "react";

export default function CardBottomAction({
  children,
  color,
}: CardBottomActionProps & PropsWithChildren) {
  return (
    <div
      className={`card-actions ${
        color ?? "bg-primary hover:bg-secondary"
      } transition-colors text-center cursor-pointer py-2 flex justify-center self-end w-full`}
    >
      {children}
    </div>
  );
}

export interface CardBottomActionProps {
  color?: string;
}
