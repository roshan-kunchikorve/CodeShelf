import Image from "next/image";
import Link from "next/link";
import { Library, LogOut, Plus } from "lucide-react";
import { auth } from "@/auth";
import { logout } from "@/actions/auth";

// A server component: it asks "who is logged in?" on the server and renders the right buttons.
export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="grid size-8 place-items-center border-2 border-ink bg-lemon">
            <Library size={18} aria-hidden="true" />
          </span>
          CodeShelf
        </Link>

        {user ? (
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard" className="hidden px-2 font-semibold underline-offset-4 hover:underline sm:block">
              My shelf
            </Link>
            <Link href="/dashboard/new" className="btn btn-primary btn-sm" aria-label="New snippet">
              <Plus size={16} aria-hidden="true" />
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">New snippet</span>
            </Link>
            {user.image ? (
              <Image
                src={user.image}
                alt="Your profile picture"
                width={32}
                height={32}
                className="size-8 border-2 border-ink"
              />
            ) : (
              <span className="grid size-8 place-items-center border-2 border-ink bg-lemon font-bold">
                {(user.name ?? "?").charAt(0).toUpperCase()}
              </span>
            )}
            <form action={logout}>
              <button type="submit" className="btn btn-sm" aria-label="Sign out">
                <LogOut size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </nav>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
