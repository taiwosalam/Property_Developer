"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Types
import type { SideNavProps } from "./types";

// Imports
import { nav_items } from "./data";
import { empty } from "@/app/config";
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";
import { useDashboardData } from "@/hooks/useDashboardData";
import useSettingsStore from "@/store/settings";
import TopNavDropdown from "./nav-topdown";

const TopNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
  const pathname = usePathname();
  const { selectedOptions } = useSettingsStore();

  const { loading, data: dashboardData } = useDashboardData();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown((prevActive) => (prevActive === label ? null : label));
  };

  const navbar = selectedOptions.navbar;

  return (
    <div className={`flex pb-3 ${navbar === "row" ? "flex-row" : "flex-col"}`}>
      <div className="flex md:hidden justify-center p-3 pt-0">
        <Image
          src={dashboardData?.logo || empty}
          alt="logo"
          width={200}
          height={55}
          className="w-full h-[55px] object-cover"
        />
      </div>

      {nav_items.map((item, idx) =>
        item.content ? (
          <TopNavDropdown
            key={idx}
            type={item.type}
            topNav={true}
            content={item.content}
            onToggle={() => handleDropdownToggle(item.label)}
          >
            {item.label}
          </TopNavDropdown>
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

export default TopNav;
