import React from "react";

export default function CardGrid({ children }: React.PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 mx-4 md:grid-cols-2 gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
