import { PropsWithChildren } from "react";

export default function FlexCenter({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-center items-center">{children}</div>
  );
}
