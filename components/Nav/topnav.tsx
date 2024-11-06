"use client";

import { usePathname } from "next/navigation";

// Imports
import { nav_items } from "./data";
import { NavButton } from "./nav-components";
import TopNavDropdown from "./nav-topdown";

const TopNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex overflow-x-auto no-scrollbar">
      {nav_items.map((item, idx) =>
        item.content ? (
          <TopNavDropdown
            key={idx}
            type={item.type}
            content={item.content}
            highlight={item.content.some((i) =>
              pathname.includes(`${item.label}${i.href}`)
            )}
          >
            {item.label}
          </TopNavDropdown>
        ) : (
          <NavButton
            highlight={item.href ? pathname.includes(item.href) : false}
            key={idx}
            href={item.href}
            type={item.type}
          >
            {item.label}
          </NavButton>
        )
      )}
    </div>
  );
};

export default TopNav;
