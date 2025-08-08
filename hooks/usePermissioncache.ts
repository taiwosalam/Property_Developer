import { useMemo } from "react";
import { usePermission } from "@/hooks/getPermission";

export const usePermissionsCache = (
  role: string,
  permissionMapping: Record<
    string,
    { permission: string; ownerRoles: string[] }
  >
): Record<string, boolean> => {
  return useMemo(() => {
    const cache: Record<string, boolean> = {};
    Object.entries(permissionMapping).forEach(([label, mapping]) => {
      cache[label] = usePermission(role, mapping.permission);
    });
    return cache;
  }, [role, permissionMapping]);
};
