import { usePermissionsStore } from "@/store/permissions";
import { useMemo } from "react";

const roleMapping: Record<string, string> = {
  "admin configuration (company director)": "director",
  "partner configuration (branch manager)": "manager",
  "colleague configuration (account officer)": "account",
  "staff configuration (other staff)": "staff",
  "Users Configuration (Landlord, Occupant & Tenants)": "user",
};

export const getRoleTitle = (shortRole: string): string => {
  return (
    Object.keys(roleMapping).find((key) => roleMapping[key] === shortRole) ||
    shortRole
  );
};

export const usePermission = (role: string, permission: string): boolean => {
  const { permissions } = usePermissionsStore();

  return useMemo(() => {
    const title = getRoleTitle(role);
    const formattedPermission = permission
      .toLowerCase()
      .replace(/[\s\/&-]+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    return permissions[title]?.includes(formattedPermission) || false;
  }, [permissions, role, permission]);
};

