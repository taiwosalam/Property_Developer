"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { empty } from "@/app/config";
import type { SideNavProps } from "./types";
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { getNavs } from "@/app/(onboarding)/auth/data";
import { useRole } from "@/hooks/roleContext";
import { useBranchInfoStore } from "@/store/branch-info-store";
import { normalizeIsActive } from "../Management/Staff-And-Branches/Branch/branch-balance-card";
import {
  filterNavItems,
  sanitizeClassName,
  useNavPermissions,
  type NavItem,
} from "./sidenav-permission";

const SideNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { role } = useRole();
  const isCompanyOwner = usePersonalInfoStore((state) => state.is_owner);
  const branchWallet = useBranchInfoStore((s) => s.sub_wallet);
  const company_logo = usePersonalInfoStore((state) => state.company_logo);

  const managerWalletIsActive = useMemo(
    () => normalizeIsActive(branchWallet?.is_active as string | boolean),
    [branchWallet?.is_active]
  );

  // Get permissions and configuration
  const { permissionsCache, permissionMapping } = useNavPermissions(role);

  // Filter navigation items based on permissions
  const navItems = useMemo(() => {
    const items: any = getNavs(role);
    return filterNavItems({
      items,
      role,
      permissionsCache,
      permissionMapping,
      managerWalletIsActive,
      isCompanyOwner,
    });
  }, [
    role,
    permissionsCache,
    permissionMapping,
    managerWalletIsActive,
    isCompanyOwner,
  ]);

  const handleDropdownToggle = useMemo(
    () => (label: string) => {
      setActiveDropdown((prevActive) => (prevActive === label ? null : label));
    },
    []
  );

  const isHighlighted = (item: NavItem): boolean => {
    if (item.content) {
      return item.content.some((i) =>
        role === "director"
          ? pathname.includes(`${item.label}${i.href || ""}`)
          : pathname.includes(`${i.href || ""}`)
      );
    }
    return item.href ? pathname.includes(item.href) : false;
  };

  return (
    <div className="custom-flex-col pb-3">
      {/* <div className="flex lg:block hidden justify-center p-3 pt-0">
        <Image
          src={company_logo || empty}
          alt="company logo"
          width={200}
          height={55}
          className="w-full h-[55px] object-contain"
        />
      </div> */}

      {navItems.map((item, idx) => {
        const className = sanitizeClassName(item.label);
        return item.content ? (
          <NavDropdown
            key={`${item.label}-${idx}`}
            type={item.type}
            content={item.content}
            highlight={isHighlighted(item)}
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
            key={`${item.label}-${idx}`}
            highlight={isHighlighted(item)}
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