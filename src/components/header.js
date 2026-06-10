"use client";
import Link from "next/link";

const links = [
  { label: "Home", href: "./" },
  { label: "Keepers", href: "/keepers" },
];

export default function Header() {
  return (
    <div className="w-full bg-white grid grid-cols-2 p-3 py-5">
      <div className="flex justify-center font-black text-3xl uppercase">
        <h1>Fantasy Wet D</h1>
      </div>
      <Navbar />
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
