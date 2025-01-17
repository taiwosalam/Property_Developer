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
import Cookies from "js-cookie";

const SideNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const role = Cookies.get("role") || "";
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown((prevActive) => (prevActive === label ? null : label));
  };

  const company_logo = usePersonalInfoStore((state) => state.company_logo);
  const isDirector = role === "director";

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

      {getNavs(role)?.map((item, idx) =>
        item.content ? (
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
          >
            {item.label}
          </NavDropdown>
        ) : (
          <NavButton
            // highlight={
            //   item.href &&
            //   isDirector
            //     ? pathname.includes(item.href)
            //     : pathname.includes(`${item.href}`)
            // }
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
