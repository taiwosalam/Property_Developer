"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useBranchInfoStore } from "@/store/branch-info-store";
import { useRole } from "@/hooks/roleContext";
import { useModule } from "@/contexts/moduleContext";
import {
  filterNavItems,
  useNavPermissions,
  sanitizeClassName,
  NavItem,
} from "./sidenav-permission";
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";

interface SideNavProps {
  closeSideNav?: () => void;
  isCollapsed?: boolean;
}

const normalizeIsActive = (value: string | boolean): boolean => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return !!value;
};

const SideNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
  const pathname = usePathname();
  const { role } = useRole();
  const { activeModule } = useModule();
  const isCompanyOwner = usePersonalInfoStore((state) => state.is_owner);
  const branchWallet = useBranchInfoStore((s) => s.sub_wallet);

  const managerWalletIsActive = useMemo(
    () => normalizeIsActive(branchWallet?.is_active as string | boolean),
    [branchWallet?.is_active]
  );

  // console.log("activeModule",activeModule)
  const { permissionsCache, permissionMapping } = useNavPermissions(
    role,
    activeModule.permissionMapping
  );

  const navItems = useMemo(() => {
    const items = activeModule.getNavItems(role) || [];
    return (
      filterNavItems({
        items,
        role,
        permissionsCache,
        permissionMapping,
        managerWalletIsActive,
        isCompanyOwner,
      }) || []
    );
  }, [
    activeModule,
    role,
    permissionsCache,
    permissionMapping,
    managerWalletIsActive,
    isCompanyOwner,
  ]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = useMemo(
    () => (label: string) => {
      setActiveDropdown((prevActive) => (prevActive === label ? null : label));
    },
    []
  );

  const isHighlighted = (item: NavItem): boolean => {
    if (item.content && item.href) {
      return item.content.some((i) =>
        i.href
          ? pathname === `${activeModule.basePath}${item.href}${i.href}`
          : false
      );
    }
    return item.href
      ? pathname === `${activeModule.basePath}${item.href}`
      : false;
  };

  return (
    <div className="custom-flex-col pb-3">
      {navItems.length === 0 ? (
        <p className="text-gray-500 p-4">No navigation items available.</p>
      ) : (
        navItems.map((item, idx) => {
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
              href={`${activeModule.basePath}${item.href}`}
              isCollapsed={isCollapsed}
              className={className}
            >
              {item.label}
            </NavDropdown>
          ) : (
            <NavButton
              key={`${item.label}-${idx}`}
              highlight={isHighlighted(item)}
              href={`${activeModule.basePath}${item.href}`}
              type={item.type}
              onClick={closeSideNav}
              isCollapsed={isCollapsed}
              className={className}
            >
              {item.label}
            </NavButton>
          );
        })
      )}
    </div>
  );
};

export default SideNav;
