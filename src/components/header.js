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
    <div className="w-full bg-white grid grid-cols-3 p-3 py-5">
      <div className="flex justify-center font-black text-3xl uppercase">
        <h1>Fantasy Wet D</h1>
      </div>
      <Navbar />
      <div className="flex justify-end">
        <button type="button" onClick={() => supabase.auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="my-auto p-2">
      <ul className="my-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="uppercase font-bold hover:border-b-2 hover:border-b-black m-2"
          >
            {link.label}
          </Link>
        ))}
      </ul>
    </div>
  );
}
