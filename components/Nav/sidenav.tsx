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
import { usePermission } from "@/hooks/getPermission";

const SideNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const { role, setRole } = useRole();
  const isCompanyOwner = usePersonalInfoStore((state) => state.is_owner);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown((prevActive) => (prevActive === label ? null : label));
  };

  const canViewCallRequests = usePermission(role, "Can view call request");
  const canViewPropertyRequests = usePermission(role, "Can view property request");
  const canViewWallet = usePermission(role, "Full Wallet Access");
  const canViewComplain = usePermission(role, "Can view complaints");

  const isDirector = role === "director";

  const company_logo = usePersonalInfoStore((state) => state.company_logo);

  const sanitizeClassName = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Define restricted labels and their conditions (for both top-level and child items)
  const restrictedLabels = [
    {
      label: "call request",
      condition: () => isDirector || canViewCallRequests,
    },
    {
      label: "property request",
      condition: () => isDirector || canViewPropertyRequests,
    },
    {
      label: "Can view complaints",
      condition: () => isDirector || canViewComplain,
    },
    {
      label: "wallet",
      condition: () => canViewWallet || isCompanyOwner || role === "manager",
    },
    // Add more restricted labels here, e.g.:
    // {
    //   label: "complaints",
    //   condition: () => usePermission(role, "Can view complaints") || isCompanyOwner,
    // },
  ];

  // Filter navItems for both top-level and child items
  const navItems = getNavs(role)
    ?.filter((item) => {
      const restricted = restrictedLabels.find(
        (r) => r.label.toLowerCase() === item.label.toLowerCase()
      );
      return !restricted || restricted.condition();
    })
    .map((item) => {
      if (item.content) {
        return {
          ...item,
          content: item.content.filter((subItem) => {
            const restricted = restrictedLabels.find(
              (r) => r.label.toLowerCase() === subItem.label.toLowerCase()
            );
            return !restricted || restricted.condition();
          }),
        };
      }
      return item;
    })
    .filter((item) => !item.content || item.content.length > 0); // Remove dropdowns that become empty

  return (
    <div className="custom-flex-col pb-3">
      <div className="flex md:hidden justify-center p-3 pt-0">
        <Image
          src={company_logo || empty}
          alt="company logo"
          width={200}
          height={55}
          className="w-full h-[55px] object-contain"
        />
      </div>

      {navItems?.map((item, idx) => {
        const className = sanitizeClassName(item.label);
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