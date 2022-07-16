import { Tooltip } from "@nextui-org/react";
import { PropsWithChildren, ReactNode } from "react";

export default function CardProperty({
  children,
  name,
  tooltip,
}: CardPropertyProps & PropsWithChildren) {
  if (tooltip)
    return (
      <div>
        <Tooltip content={tooltip}>
          <span className="text-primary">{name}</span>
        </Tooltip>
        {children}
      </div>
    );

  return (
    <div>
      <span className="block text-primary">{name}</span>
      {children}
    </div>
  );
}

export interface CardPropertyProps {
  name: string;
  tooltip?: string;
}
