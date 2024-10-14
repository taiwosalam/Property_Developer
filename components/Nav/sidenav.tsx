"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Types
import type { SidenavProps } from "./types";

// Imports
import { nav_items } from "./data";
import { empty } from "@/app/config";
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";

const Sidenav: React.FC<SidenavProps> = ({ showLogo, closeSidenav }) => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(prevActive => prevActive === label ? null : label);
  };

  return (
    <div className="custom-flex-col w-[250px] m pb-3in-w-[250px]">
      {showLogo && (
        <div className="flex justify-center p-3 pt-0">
          <Image
            src={empty}
            alt="logo"
            className="w-full h-[55px] object-cover"
          />
        </div>
      )}
      {nav_items.map((item, idx) =>
        item.content ? (
          <NavDropdown
            key={idx}
            type={item.type}
            content={item.content}
            highlight={item.content.some((i) =>
              pathname.includes(`${item.label}${i.href}`)
            )}
            onContentClick={closeSidenav}
            isOpen={activeDropdown === item.label}
            onToggle={() => handleDropdownToggle(item.label)}
          >
            {item.label}
          </NavDropdown>
        ) : (
          <NavButton
            highlight={item.href ? pathname.includes(item.href) : false}
            key={idx}
            href={item.href}
            type={item.type}
            onClick={closeSidenav}
          >
            {item.label}
          </NavButton>
        )
      )}
    </div>
  );
};

export default Sidenav;