import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";

export default function AuthenticatedOnly({ children }: PropsWithChildren) {
  const session = useSession();

  if (session.status === "loading")
    return (
      <div className="flex flex-col justify-center items-center text-center w-96 mx-auto">
        <span className="text-xl">Loading</span>
      </div>
    );

  if (session.status === "unauthenticated")
    return (
      <div className="flex flex-col justify-center items-center text-center w-96 mx-auto">
        <span className="text-xl">
          You&apos;re not logged in. Please log in to continue.
        </span>
      </div>
    );

  return <>{children}</>;
}
