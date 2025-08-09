import { usePermission } from "@/hooks/getPermission";
import { useMemo } from "react";

// Define the valid icon types based on your component requirements
export type ValidIconType =
  | "buildings"
  | "people"
  | "menu_board"
  | "status_up"
  | "empty_wallet"
  | "folder"
  | "chart"
  | "task"
  | "settings"
  | "briefcase_timer"
  | "horizontal_line"
  | "arrow_down"
  | "sidebar"
  | "list"
  | "grid"
  | "eye";

export interface NavItem {
  label: string;
  href: string;
  type: ValidIconType;
  content: NavItem[];
}

interface FilterNavItemsParams {
  items: NavItem[] | null;
  role: string;
  permissionsCache: Record<string, boolean>;
  permissionMapping: Record<
    string,
    { permission: string; ownerRoles: string[] }
  >;
  managerWalletIsActive: boolean;
  isCompanyOwner: boolean;
}

export const permissionMapping: Record<
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
    ownerRoles: ["manager", "account", "staff"],
  },
  "visitors request": {
    permission: "Can check in visitors",
    ownerRoles: ["manager", "account", "staff"],
  },
  // inventory: {
  //   permission: "Can create inventory",
  //   ownerRoles: ["manager", "account", "staff"],
  // },
  "vehicles record": {
    permission: "Can check in and manage vehicle records",
    ownerRoles: ["manager", "account"],
  },
  // invoice: {
  //   permission: "Can manage tenants/occupants",
  //   ownerRoles: ["manager", "account"],
  // },
  // expenses: {
  //   permission: "Can manage tenants/occupants",
  //   ownerRoles: ["manager", "account"],
  // },
  // disbursement: {
  //   permission: "Can manage tenants/occupants",
  //   ownerRoles: ["manager", "account"],
  // },
};

export const useNavPermissions = (role: string) => {
  // Call all permissions at the top level 
  const callRequestPerm = usePermission(role, "Can view call request");
  const propertyRequestPerm = usePermission(role, "Can view property request");
  const complaintsPerm = usePermission(role, "Can view complaints");
  const walletPerm = usePermission(role, "Full Wallet Access");
  const landlordPerm = usePermission(
    role,
    "Can add and manage landlords/landlady"
  );
  const tenantsPerm = usePermission(
    role,
    "Can add and manage tenants/occupants"
  );
  const propertiesPerm = usePermission(
    role,
    "Can add/delete branch properties"
  );
  const serviceProvidersPerm = usePermission(role, "Can view service provider");
  const examinePerm = usePermission(role, "Can create examine");
  const inspectionsPerm = usePermission(role, "Can manage inspections");
  const calendarsPerm = usePermission(role, "Can manage calendar");
  const announcementsPerm = usePermission(
    role,
    "Can create and manage announcement"
  );
  const visitorsRequestPerm = usePermission(role, "Can check in visitors");
  const inventoryPerm = usePermission(role, "Can create inventory");
  const vehiclesRecordPerm = usePermission(
    role,
    "Can check in and manage vehicle records"
  );

  // Create permissions cache using the hook results
  const permissionsCache = useMemo(
    () => ({
      "call request": callRequestPerm,
      "property request": propertyRequestPerm,
      complaints: complaintsPerm,
      wallet: walletPerm,
      "landlord & landlady": landlordPerm,
      "tenants & occupants": tenantsPerm,
      properties: propertiesPerm,
      "service providers": serviceProvidersPerm,
      examine: examinePerm,
      inspections: inspectionsPerm,
      calendars: calendarsPerm,
      announcements: announcementsPerm,
      "visitors request": visitorsRequestPerm,
      inventory: inventoryPerm,
      "vehicles record": vehiclesRecordPerm,
      invoice: tenantsPerm,
      expenses: tenantsPerm,
      disbursement: tenantsPerm,
    }),
    [
      callRequestPerm,
      propertyRequestPerm,
      complaintsPerm,
      walletPerm,
      landlordPerm,
      tenantsPerm,
      propertiesPerm,
      serviceProvidersPerm,
      examinePerm,
      inspectionsPerm,
      calendarsPerm,
      announcementsPerm,
      visitorsRequestPerm,
      inventoryPerm,
      vehiclesRecordPerm,
    ]
  );

  return { permissionsCache, permissionMapping };
};

export const sanitizeClassName = (label: string): string =>
  label
    ? label
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : "";

// Helper function to ensure type safety
const ensureValidType = (type: string | undefined): ValidIconType => {
  const validTypes: ValidIconType[] = [
    "buildings",
    "people",
    "menu_board",
    "status_up",
    "empty_wallet",
    "folder",
    "chart",
    "task",
    "settings",
    "briefcase_timer",
    "horizontal_line",
    "arrow_down",
    "sidebar",
    "list",
  ];

  return validTypes.includes(type as ValidIconType)
    ? (type as ValidIconType)
    : "folder";
};

export const filterNavItems = ({
  items,
  role,
  permissionsCache,
  permissionMapping,
  managerWalletIsActive,
  isCompanyOwner,
}: FilterNavItemsParams): NavItem[] => {
  // Handle null or undefined items
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => {
      if (!item || typeof item.label !== "string") {
        return false;
      }
      const mapping = permissionMapping[item.label.toLowerCase()];

      // Render item if no permission is defined or role is not an owner
      if (!mapping || !mapping.ownerRoles.includes(role)) {
        return true;
      }

      // Special case for "wallet"
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
      // Ensure type safety by providing a valid type
      const safeItem: NavItem = {
        ...item,
        type: ensureValidType(item.type),
      };

      if (safeItem.content && Array.isArray(safeItem.content)) {
        return {
          ...safeItem,
          content: safeItem.content
            .filter((subItem) => {
              if (!subItem || typeof subItem.label !== "string") {
                return false;
              }
              const mapping = permissionMapping[subItem.label.toLowerCase()];
              return (
                !mapping ||
                !mapping.ownerRoles.includes(role) ||
                permissionsCache[subItem.label.toLowerCase()]
              );
            })
            .map((subItem) => ({
              ...subItem,
              type: ensureValidType(subItem.type),
            })),
        };
      }
      return safeItem;
    })
    .filter((item) => !item.content || item.content.length > 0);
};
