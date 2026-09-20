"use client";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const links = [
  { label: "Home", href: "./" },
  { label: "Keepers", href: "/keepers" },
  { label: "My Keepers", href: "/mykeepers" },
];

export default function Header() {
  const supabase = createClient();
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 bg-white p-3 py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-2 sm:py-5 md:grid-cols-3">
      <div className="flex justify-center font-black text-xl uppercase sm:justify-start md:justify-center md:text-3xl">
        <h1 className="text-center leading-tight">Fantasy Wet D</h1>
      </div>
      <Navbar />
      <div className="flex justify-center sm:justify-end">
        <button
          type="button"
          className="cursor-pointer px-2 py-1 font-semibold"
          onClick={() => supabase.auth.signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="my-auto p-1 sm:p-2">
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="m-0 inline-block uppercase font-bold hover:border-b-2 hover:border-b-black"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
