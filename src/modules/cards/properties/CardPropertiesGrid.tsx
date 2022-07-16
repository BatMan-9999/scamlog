import { PropsWithChildren } from "react";

export default function CardPropertiesGrid({children}: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  );
}
