import { useMemo } from "react";
import {
  useNavPermissions,
  permissionMapping,
  ValidIconType,
  sanitizeClassName,
} from "./sidenav-permission";

// Define the interface for NavCreateNewColumn items
export interface CreateNavItem {
  label: string;
  type: ValidIconType;
  content: CreateNavSubItem[];
}

// Define the interface for sub-items with optional link or modal
export interface CreateNavSubItem {
  label: string;
  href?: string; // Renamed from 'link' to match nav_items structure
  modal?: string; // Optional modal identifier
}

interface FilterCreateNavItemsParams {
  items: CreateNavItem[] | null;
  role: string;
  permissionsCache: Record<string, boolean>;
  permissionMapping: Record<
    string,
    { permission: string; ownerRoles: string[] }
  >;
}

// Helper function to ensure type safety for icon types
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

export const filterCreateNavItems = ({
  items,
  role,
  permissionsCache,
  permissionMapping,
}: FilterCreateNavItemsParams): CreateNavItem[] => {
  // Handle null or undefined items
  if (!items || !Array.isArray(items)) {
    return [];
  }

  const options = ["management", "tasks", "accounting", "documents"];

  return items
    .filter(
      (item) =>
        item &&
        typeof item.label === "string" &&
        options.includes(item.label.toLowerCase())
    )
    .map((item) => {
      // Ensure type safety
      const safeItem: CreateNavItem = {
        ...item,
        type: ensureValidType(item.type),
        content: Array.isArray(item.content) ? item.content : [],
      };

      return {
        ...safeItem,
        content: safeItem.content
          .filter((subItem) => {
            if (!subItem || typeof subItem.label !== "string") {
              return false;
            }
            const mapping = permissionMapping[subItem.label.toLowerCase()];
            // Render sub-item if no permission is defined or role is not an owner
            return (
              !mapping ||
              !mapping.ownerRoles.includes(role) ||
              permissionsCache[subItem.label.toLowerCase()]
            );
          })
          .map((subItem) => ({
            ...subItem,
            // No type property in sub-items based on nav_items
            href: subItem.href,
            modal: subItem.modal,
          })),
      };
    })
    .filter((item) => item.content.length > 0);
};
