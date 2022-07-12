import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function NavBar({}: NavBarProps) {
  const session = useSession();

  return (
    <nav className="navbar bg-base-100">
      <div className="flex-1">
        <Link href={"/"}>
          <span className="btn btn-ghost normal-case text-xl">Scam Log</span>
        </Link>
      </div>
      <div className="flex-none">
        {session.status !== "authenticated" ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => signIn("discord")}
          >
            Login
          </button>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={
                    session.data.user?.image ??
                    // Fallback to default avatar
                    "https://cdn.discordapp.com/embed/avatars/0.png"
                  }
                  alt="Your profile picture"
                  className="mask mask-circle"
                  width={40}
                  height={40}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              {session.data.admin ? (
                <li>
                  {/* Link to admin dashboard if user is in admin table (collection) */}
                  <a href="/admin">Admin Dashboard</a>
                </li>
              ) : null}
              <li>
                <span onClick={() => signOut()}>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export interface NavBarProps {
  links: NavBarLink[];
}

export interface NavBarLink {
  name: string;
  url: string;
}
