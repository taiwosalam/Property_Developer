// "use client";

// import { useMemo, useState } from "react";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { empty } from "@/app/config";
// import type { SideNavProps } from "./types";
// import { nav_items } from "./data";
// import NavDropdown from "./nav-dropdown";
// import { NavButton } from "./nav-components";
// import { usePersonalInfoStore } from "@/store/personal-info-store";
// import { getNavs } from "@/app/(onboarding)/auth/data";
// import { useRole } from "@/hooks/roleContext";
// import { usePermission } from "@/hooks/getPermission";
// import { useBranchInfoStore } from "@/store/branch-info-store";
// import { normalizeIsActive } from "../Management/Staff-And-Branches/Branch/branch-balance-card";

// const permissionMapping: Record<
//   string,
//   { permission: string; ownerRoles: string[] }
// > = {
//   "call request": {
//     permission: "Can view call request",
//     ownerRoles: ["manager", "account", "staff"],
//   },
//   "property request": {
//     permission: "Can view property request",
//     ownerRoles: ["manager"],
//   },
//   complaints: {
//     permission: "Can view complaints",
//     ownerRoles: ["manager", "account", "staff"],
//   },
//   wallet: {
//     permission: "Full Wallet Access",
//     ownerRoles: ["director"],
//   },
//   "landlord & landlady": {
//     permission: "Can add and manage landlords/landlady",
//     ownerRoles: ["manager", "account"],
//   },
//   "tenants & occupants": {
//     permission: "Can add and manage tenants/occupants",
//     ownerRoles: ["manager", "account"],
//   },
//   properties: {
//     permission: "Can add/delete branch properties",
//     ownerRoles: ["manager", "account", "staff"],
//   },
//   "service providers": {
//     permission: "Can view service provider",
//     ownerRoles: ["account", "staff"],
//   },
//   examine: {
//     permission: "Can create examine",
//     ownerRoles: ["manager", "account", "staff"],
//   },
//   inspections: {
//     permission: "Can manage inspections",
//     ownerRoles: ["manager", "account", "staff"],
//   },
//   calendars: {
//     permission: "Can manage calendar",
//     ownerRoles: ["manager", "account", "staff"],
//   },
//   announcements: {
//     permission: "Can create and manage announcement",
//     ownerRoles: ["manager", "account"],
//   },
//   "visitors request": {
//     permission: "Can check in visitors",
//     ownerRoles: ["manager", "account", "staff"],
//   },
//   inventory: {
//     permission: "Can create inventory",
//     ownerRoles: ["manager", "account", "staff"],
//   },
//   "vehicles record": {
//     permission: "Can check in and manage vehicle records",
//     ownerRoles: ["manager", "account"],
//   },
//   invoice: {
//     permission: "Can manage tenants/occupants",
//     ownerRoles: ["manager", "account"],
//   },
//   expenses: {
//     permission: "Can manage tenants/occupants",
//     ownerRoles: ["manager", "account"],
//   },
//   disbursement: {
//     permission: "Can manage tenants/occupants",
//     ownerRoles: ["manager", "account"],
//   },
// };

// const SideNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
//   const pathname = usePathname();
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const { role } = useRole();
//   const isCompanyOwner = usePersonalInfoStore((state) => state.is_owner);
//   const branchWallet = useBranchInfoStore((s) => s.sub_wallet);
//   const company_logo = usePersonalInfoStore((state) => state.company_logo);

//   const managerWalletIsActive = normalizeIsActive(
//     branchWallet?.is_active as string | boolean
//   );

//   // Pre-compute permissions to avoid calling usePermission in a callback
//   const permissionsCache: Record<string, boolean> = useMemo(() => {
//     const cache: Record<string, boolean> = {};
//     Object.entries(permissionMapping).forEach(([label, mapping]) => {
//       cache[label] = usePermission(role, mapping.permission);
//     });
//     return cache;
//   }, [role]);

//   const navItems = useMemo(() => {
//     return getNavs(role)
//       ?.filter((item) => {
//         const mapping = permissionMapping[item.label.toLowerCase()];
//         // Render top-level item if no permission is defined or role is not an owner
//         if (!mapping || !mapping.ownerRoles.includes(role)) {
//           return true;
//         }
//         // Special case for "wallet" with additional conditions
//         if (item.label.toLowerCase() === "wallet") {
//           return (
//             permissionsCache["wallet"] ||
//             (role === "manager" && managerWalletIsActive) ||
//             isCompanyOwner
//           );
//         }
//         return permissionsCache[item.label.toLowerCase()];
//       })
//       .map((item) => {
//         if (item.content) {
//           return {
//             ...item,
//             content: item.content.filter((subItem) => {
//               const mapping = permissionMapping[subItem.label.toLowerCase()];
//               // Render sub-item if no permission is defined or role is not an owner
//               return (
//                 !mapping ||
//                 !mapping.ownerRoles.includes(role) ||
//                 permissionsCache[subItem.label.toLowerCase()]
//               );
//             }),
//           };
//         }
//         return item;
//       })
//       .filter((item) => !item.content || item.content.length > 0);
//   }, [role, permissionsCache, managerWalletIsActive, isCompanyOwner]);

//   const sanitizeClassName = (label: string): string =>
//     label
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "");

//   const handleDropdownToggle = (label: string) => {
//     setActiveDropdown((prevActive) => (prevActive === label ? null : label));
//   };

//   return (
//     <div className="custom-flex-col pb-3">
//       <div className="flex md:hidden justify-center p-3 pt-0">
//         <Image
//           src={company_logo || empty}
//           alt="company logo"
//           width={200}
//           height={55}
//           className="w-full h-[55px] object-contain"
//         />
//       </div>

//       {navItems?.map((item, idx) => {
//         const className = sanitizeClassName(item.label);
//         return item.content ? (
//           <NavDropdown
//             key={idx}
//             type={item.type}
//             content={item.content}
//             highlight={item.content.some((i) =>
//               role === "director"
//                 ? pathname.includes(`${item.label}${i.href}`)
//                 : pathname.includes(`${i.href}`)
//             )}
//             onContentClick={closeSideNav}
//             isOpen={activeDropdown === item.label}
//             onToggle={() => handleDropdownToggle(item.label)}
//             isCollapsed={isCollapsed}
//             className={className}
//           >
//             {item.label}
//           </NavDropdown>
//         ) : (
//           <NavButton
//             highlight={item.href ? pathname.includes(item.href) : false}
//             key={idx}
//             href={item.href}
//             type={item.type}
//             onClick={closeSideNav}
//             isCollapsed={isCollapsed}
//             className={className}
//           >
//             {item.label}
//           </NavButton>
//         );
//       })}
//     </div>
//   );
// };

// export default SideNav;

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { empty } from "@/app/config";
import type { SideNavProps } from "./types";
import { nav_items } from "./data";
import NavDropdown from "./nav-dropdown";
import { NavButton } from "./nav-components";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { getNavs } from "@/app/(onboarding)/auth/data";
import { useRole } from "@/hooks/roleContext";
import { useBranchInfoStore } from "@/store/branch-info-store";
import { normalizeIsActive } from "../Management/Staff-And-Branches/Branch/branch-balance-card";
import { usePermissionsCache } from "@/hooks/usePermissioncache";

const permissionMapping: Record<
  string,
  { permission: string; ownerRoles: string[] }
> = {
  "call request": {
    permission: "Can view call request",
    ownerRoles: ["manager", "account", "staff"],
  },
  "property request": {
    permission: "Can view property request",
    ownerRoles: ["manager"],
  },
  complaints: {
    permission: "Can view complaints",
    ownerRoles: ["manager", "account", "staff"],
  },
  wallet: {
    permission: "Full Wallet Access",
    ownerRoles: ["director"],
  },
  "landlord & landlady": {
    permission: "Can add and manage landlords/landlady",
    ownerRoles: ["manager", "account"],
  },
  "tenants & occupants": {
    permission: "Can add and manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  properties: {
    permission: "Can add/delete branch properties",
    ownerRoles: ["manager", "account", "staff"],
  },
  "service providers": {
    permission: "Can view service provider",
    ownerRoles: ["account", "staff"],
  },
  examine: {
    permission: "Can create examine",
    ownerRoles: ["manager", "account", "staff"],
  },
  inspections: {
    permission: "Can manage inspections",
    ownerRoles: ["manager", "account", "staff"],
  },
  calendars: {
    permission: "Can manage calendar",
    ownerRoles: ["manager", "account", "staff"],
  },
  announcements: {
    permission: "Can create and manage announcement",
    ownerRoles: ["manager", "account"],
  },
  "visitors request": {
    permission: "Can check in visitors",
    ownerRoles: ["manager", "account", "staff"],
  },
  inventory: {
    permission: "Can create inventory",
    ownerRoles: ["manager", "account", "staff"],
  },
  "vehicles record": {
    permission: "Can check in and manage vehicle records",
    ownerRoles: ["manager", "account"],
  },
  invoice: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  expenses: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  disbursement: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
};

const SideNav: React.FC<SideNavProps> = ({ closeSideNav, isCollapsed }) => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { role } = useRole();
  const isCompanyOwner = usePersonalInfoStore((state) => state.is_owner);
  const branchWallet = useBranchInfoStore((s) => s.sub_wallet);
  const company_logo = usePersonalInfoStore((state) => state.company_logo);

  const managerWalletIsActive = normalizeIsActive(
    branchWallet?.is_active as string | boolean
  );

  // Use custom hook to get permissions cache
  const permissionsCache = usePermissionsCache(role, permissionMapping);

  const navItems = useMemo(() => {
    return getNavs(role)
      ?.filter((item) => {
        const mapping = permissionMapping[item.label.toLowerCase()];
        // Render top-level item if no permission is defined or role is not an owner
        if (!mapping || !mapping.ownerRoles.includes(role)) {
          return true;
        }
        // Special case for "wallet" with additional conditions
        if (item.label.toLowerCase() === "wallet") {
          return (
            permissionsCache["wallet"] ||
            (role === "manager" && managerWalletIsActive) ||
            isCompanyOwner
          );
        }
        return permissionsCache[item.label.toLowerCase()];
      })
      .map((item) => {
        if (item.content) {
          return {
            ...item,
            content: item.content.filter((subItem) => {
              const mapping = permissionMapping[subItem.label.toLowerCase()];
              // Render sub-item if no permission is defined or role is not an owner
              return (
                !mapping ||
                !mapping.ownerRoles.includes(role) ||
                permissionsCache[subItem.label.toLowerCase()]
              );
            }),
          };
        }
        return item;
      })
      .filter((item) => !item.content || item.content.length > 0);
  }, [role, permissionsCache, managerWalletIsActive, isCompanyOwner]);

  const sanitizeClassName = (label: string): string =>
    label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown((prevActive) => (prevActive === label ? null : label));
  };

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
              role === "director"
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
