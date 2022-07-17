import { PropsWithChildren } from "react";

export default function FlexVertical({children}: PropsWithChildren){
  return (
    <div className="flex items-center">
      {children}
    </div>
  );
}