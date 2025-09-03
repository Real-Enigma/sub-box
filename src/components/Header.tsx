"use client";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="border-b bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-md bg-foreground text-background font-bold px-3 py-2 dark:bg-white/90 dark:text-black">SB</div>
            <span className="text-lg font-semibold">Subscription Box</span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/plans" className="text-sm hover:underline">Plans</Link>
          <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
          <Link href="/admin" className="text-sm hover:underline">Admin</Link>
          {user ? (
            <button
              onClick={() => signOut(auth)}
              className="ml-4 text-sm bg-red-600 text-white px-3 py-1 rounded"
            >
              Sign out
            </button>
          ) : (
            <Link href="/auth" className="ml-4 text-sm bg-blue-600 text-white px-3 py-1 rounded">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
