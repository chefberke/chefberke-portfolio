import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className="font-light flex items-center gap-8 text-sm">
      <Link
        href={"/"}
        className="hover:opacity-85 transition-all hover:cursor-pointer select-none"
      >
        home
      </Link>
      <Link
        href={"/projects"}
        className="hover:opacity-85 transition-all hover:cursor-pointer select-none"
      >
        projects
      </Link>
      <Link
        href={"/skills"}
        className="hover:opacity-85 transition-all hover:cursor-pointer select-none"
      >
        skills
      </Link>
      <Link
        href={"/setup"}
        className="hover:opacity-85 transition-all hover:cursor-pointer select-none"
      >
        setup
      </Link>
      <Link
        href={"/contact"}
        className="hover:opacity-85 transition-all hover:cursor-pointer select-none"
      >
        contact
      </Link>
    </div>
  );
}

export default Navbar;
