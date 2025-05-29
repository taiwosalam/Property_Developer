"use client";

import { useEffect, useState } from "react";
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
import { getNavs } from "@/app/(onboarding)/auth/data";
import { useRole } from "@/hooks/roleContext";

const SideNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { role, setRole } = useRole();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown((prevActive) => (prevActive === label ? null : label));
  };

  const company_logo = usePersonalInfoStore((state) => state.company_logo);
  const isDirector = role === "director";

  const sanitizeClassName = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove any characters that aren't letters, numbers, or hyphens
  };

  
  return (
    <div className='custom-flex-col pb-3'>
      <div className='flex md:hidden justify-center p-3 pt-0'>
        <Image
          src={company_logo || empty}
          alt='company logo'
          width={200}
          height={55}
          className='w-full h-[55px] object-contain'
        />
      </div>

      {getNavs(role)?.map((item, idx) => {
        const className = sanitizeClassName(item.label); // Sanitize the label for use as a class name
        return item.content ? (
          <NavDropdown
            key={idx}
            type={item.type}
            content={item.content}
            highlight={item.content.some((i) =>
              isDirector
                ? pathname.includes(`${item.label}${i.href}`)
                : pathname.includes(`${i.href}`)
            )}
            onContentClick={closeSideNav}
            isOpen={activeDropdown === item.label}
            onToggle={() => handleDropdownToggle(item.label)}
            isCollapsed={isCollapsed}
            className={className} 
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
            className={className} 
          >
            {item.label}
          </NavButton>
        );
      })}
    </div>
  );
};
export default SideNav;
