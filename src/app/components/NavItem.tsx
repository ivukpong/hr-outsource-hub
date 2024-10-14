import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function NavItem({
  text,
  href,
  active,
  icon,
}: {
  text: string;
  href: string;
  active: boolean;
  icon: string;
}) {
  const pathname = usePathname();
  return (
    <Link href={href}>
      <li
        className={`px-4 py-2 h-12 my-1 rounded-r-[10px] ${active || (pathname === "/dashboard" && text === "Dashboard") ? `bg-secondary border-l-primary border-l-[3px] text-primary font-bold` : ""} text-gray-700 hover:bg-secondary cursor-pointer`}
      >
        <div className="flex gap-2 items-center">
          <i className={`${icon} mr-2`}></i>
          {text}
        </div>
      </li>
    </Link>
  );
}

export default NavItem;
