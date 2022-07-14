import React from "react";

export default function CardDisplayLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-evenly mb-4">
      {children}
    </div>
  );
}
