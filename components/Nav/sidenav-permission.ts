import { useMemo } from "react";
import { usePermission } from "@/hooks/getPermission";
import { NavItemsProps } from "./types";

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
  | "right_arrow"
  | "user_tag"
  | "eye";

export interface NavItem {
  label: string;
  href?: string;
  type: ValidIconType;
  content?: NavItem[];
}

interface FilterNavItemsParams {
  // items: NavItem[] | null;
  items: NavItemsProps | null;
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
  "service providers": {
    permission: "Can view service provider",
    ownerRoles: ["account", "staff"],
  },
  "visitors request": {
    permission: "Can check in visitors",
    ownerRoles: ["manager", "account", "staff"],
  },
  "team chat": {
    permission: "Can view and reply branch messages",
    ownerRoles: ["manager", "account", "staff"],
  },
};

export const useNavPermissions = (
  role: string,
  customPermissionMapping: Record<
    string,
    { permission: string; ownerRoles: string[] }
  > = permissionMapping
) => {
  // Compute permissions at the top level
  const callRequestPerm = usePermission(
    role,
    customPermissionMapping["call request"]?.permission ||
      "Can view call request"
  );
  const propertyRequestPerm = usePermission(
    role,
    customPermissionMapping["property request"]?.permission ||
      "Can view property request"
  );
  const complaintsPerm = usePermission(
    role,
    customPermissionMapping["complaints"]?.permission || "Can view complaints"
  );
  const walletPerm = usePermission(
    role,
    customPermissionMapping["wallet"]?.permission || "Full Wallet Access"
  );
  const teamChatPerm =
    usePermission(
      role,
      customPermissionMapping["team chat"]?.permission ||
        "Can view and reply branch messages"
    ) || role === "director";
  const landlordPerm = usePermission(
    role,
    customPermissionMapping["landlord & landlady"]?.permission ||
      "Can add and manage landlords/landlady"
  );
  const tenantsPerm = usePermission(
    role,
    customPermissionMapping["tenants & occupants"]?.permission ||
      "Can add and manage tenants/occupants"
  );
  const propertiesPerm = usePermission(
    role,
    customPermissionMapping["properties"]?.permission ||
      "Can add/delete branch properties"
  );
  const serviceProvidersPerm = usePermission(
    role,
    customPermissionMapping["service providers"]?.permission ||
      "Can view service provider"
  );
  const examinePerm = usePermission(
    role,
    customPermissionMapping["examine"]?.permission || "Can create examine"
  );
  const inspectionsPerm = usePermission(
    role,
    customPermissionMapping["inspections"]?.permission ||
      "Can manage inspections"
  );
  const calendarsPerm = usePermission(
    role,
    customPermissionMapping["calendars"]?.permission || "Can manage calendar"
  );
  const announcementsPerm = usePermission(
    role,
    customPermissionMapping["announcements"]?.permission ||
      "Can create and manage announcement"
  );
  const visitorsRequestPerm = usePermission(
    role,
    customPermissionMapping["visitors request"]?.permission ||
      "Can check in visitors"
  );
  const inventoryPerm = usePermission(
    role,
    customPermissionMapping["inventory"]?.permission || "Can create inventory"
  );
  const vehiclesRecordPerm = usePermission(
    role,
    customPermissionMapping["vehicles record"]?.permission ||
      "Can check in and manage vehicle records"
  );

  const permissionsCache = useMemo(() => {
    const basePermissions = {
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
      "team chat": teamChatPerm,
      invoice: tenantsPerm,
      expenses: tenantsPerm,
      disbursement: tenantsPerm,
    };

    // Add permissions from customPermissionMapping
    const additionalPermissions = Object.keys(customPermissionMapping).reduce(
      (acc, key) => ({
        ...acc,
        [key]: customPermissionMapping[key].ownerRoles.includes(role),
      }),
      {} as Record<string, boolean>
    );

    return { ...basePermissions, ...additionalPermissions };
  }, [
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
    teamChatPerm,
    customPermissionMapping,
    role,
  ]);

  return { permissionsCache, permissionMapping: customPermissionMapping };
};

export const sanitizeClassName = (label: string): string =>
  label
    ? label
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : "";

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
    "grid",
    "eye",
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
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => {
      if (!item || typeof item.label !== "string") {
        return false;
      }
      const mapping = permissionMapping[item.label.toLowerCase()];
      // Allow navigation if no permission mapping exists (for modules like hospitality_manager)
      if (!mapping) {
        return true;
      }
      if (!mapping.ownerRoles.includes(role)) {
        return false;
      }
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
      const safeItem: any = {
        ...item,
        type: ensureValidType(item.type),
      };
      if (safeItem.content && Array.isArray(safeItem.content)) {
        return {
          ...safeItem,
          content: safeItem.content
            .filter((subItem:any) => {
              if (!subItem || typeof subItem.label !== "string") {
                return false;
              }
              const mapping = permissionMapping[subItem.label.toLowerCase()];
              // Allow sub-navigation if no permission mapping exists
              return (
                !mapping ||
                !mapping.ownerRoles.includes(role) ||
                permissionsCache[subItem.label.toLowerCase()]
              );
            })
            .map((subItem: any) => ({
              ...subItem,
              type: ensureValidType(subItem.type),
            })),
        };
      }
      return safeItem;
    })
    .filter((item) => !item.content || item.content.length > 0);
};
