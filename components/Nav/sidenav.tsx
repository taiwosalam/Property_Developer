"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { empty } from "@/app/config";
// Types
import type { SideNavProps } from "./types";

// Imports
import { nav_items } from "./data";
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const SideNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
  const pathname = usePathname();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown((prevActive) => (prevActive === label ? null : label));
  };

  const company_logo = usePersonalInfoStore((state) => state.company_logo);

  return (
    <div className="custom-flex-col pb-3">
      <div className="flex md:hidden justify-center p-3 pt-0">
        <Image
          src={company_logo || empty}
          alt="company logo"
          width={200}
          height={55}
          className="w-full h-[55px] object-cover"
        />
      </div>

      {nav_items.map((item, idx) =>
        item.content ? (
          <NavDropdown
            key={idx}
            type={item.type}
            content={item.content}
            highlight={item.content.some((i) =>
              pathname.includes(`${item.label}${i.href}`)
            )}
            onContentClick={closeSideNav}
            isOpen={activeDropdown === item.label}
            onToggle={() => handleDropdownToggle(item.label)}
            isCollapsed={isCollapsed}
          >
            {item.label}
          </NavDropdown>
        ) : (
          <NavButton
            highlight={item.href ? pathname.includes(item.href) : false}
            key={idx}
            href={item.href}
            type={item.type}
            onClick={closeSideNav}
            isCollapsed={isCollapsed}
          >
            {item.label}
          </NavButton>
        )
      )}
    </div>
  );
};

export default SideNav;
