"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Imports
import { nav_items } from "./data";
import { NavButton } from "./nav-components";
import TopNavDropdown from "./nav-topdown";
import { getNavs } from "@/app/(onboarding)/auth/data";
import Cookies from "js-cookie";
import { getRoleFromCookie } from "@/utils/getRole";
import { useRole } from "@/hooks/roleContext";


const TopNav = () => {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  
  console.log("user role", role)

  return (
    <div className="flex overflow-x-auto no-scrollbar">
      {getNavs(role)?.map((item, idx) =>
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
            topNav
          >
            {item.label}
          </NavButton>
        )
      )}
    </div>
  );
};

export default TopNav;
