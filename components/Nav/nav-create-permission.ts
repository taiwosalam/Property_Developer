import { usePermission } from "@/hooks/getPermission";
import { useMemo } from "react";
import { SVGType } from "../SVG/types";

// Permission mapping for nav create items
export const permissionMapping: Record<
  string,
  { permission: string; ownerRoles: string[] }
> = {
  "landlord / landlady": {
    permission: "Can add and manage landlords/landlady",
    ownerRoles: ["manager", "account"],
  },
  "tenants / occupants": {
    permission: "Can add and manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  branch: {
    permission: "Can add/delete branch properties",
    ownerRoles: ["manager", "account"],
  },
  property: {
    permission: "Can add/delete branch properties",
    ownerRoles: ["manager", "account", "staff"],
  },
  "service provider": {
    permission: "Can create service provider",
    ownerRoles: ["manager"],
  },
  examine: {
    permission: "Can create examine",
    ownerRoles: ["manager", "account", "staff"],
  },
  maintenance: {
    permission: "Can manage inspections",
    ownerRoles: ["manager", "account", "staff"],
  },
  reminder: {
    permission: "Can manage calendar",
    ownerRoles: ["manager", "account", "staff"],
  },
  announcement: {
    permission: "Can create and manage announcement",
    ownerRoles: ["manager", "account"],
  },
  invoice: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["account"],
  },
  expenses: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["account"],
  },
  disbursement: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["account"],
  },
  "tenancy agreement": {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  "other documents": {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  "tenancy form": {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["staff"],
  },
  "management form": {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["staff"],
  },
};

// Custom hook for nav create permissions
export const useNavCreatePermissions = (role: string) => {
  // Call all permissions at the top level - React-compliant way
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
  const serviceProviderPerm = usePermission(
    role,
    "Can create service provider"
  );
  const examinePerm = usePermission(role, "Can create examine");
  const inspectionsPerm = usePermission(role, "Can manage inspections");
  const calendarPerm = usePermission(role, "Can manage calendar");
  const announcementPerm = usePermission(
    role,
    "Can create and manage announcement"
  );

  // Create permissions cache using the hook results
  const permissionsCache = useMemo(
    () => ({
      "landlord / landlady": landlordPerm,
      "tenants / occupants": tenantsPerm,
      branch: propertiesPerm,
      property: propertiesPerm,
      "service provider": serviceProviderPerm,
      examine: examinePerm,
      maintenance: inspectionsPerm,
      reminder: calendarPerm,
      announcement: announcementPerm,
      invoice: tenantsPerm, // Reusing tenants permission
      expenses: tenantsPerm, // Reusing tenants permission
      disbursement: tenantsPerm, // Reusing tenants permission
      "tenancy agreement": tenantsPerm, // Reusing tenants permission
      "other documents": tenantsPerm, // Reusing tenants permission
      "tenancy form": tenantsPerm, // Reusing tenants permission
      "management form": tenantsPerm, // Reusing tenants permission
    }),
    [
      landlordPerm,
      tenantsPerm,
      propertiesPerm,
      serviceProviderPerm,
      examinePerm,
      inspectionsPerm,
      calendarPerm,
      announcementPerm,
    ]
  );

  return { permissionsCache, permissionMapping };
};

// Define interfaces for better type safety
export interface NavCreateItem {
  label: string;
  link?: string;
  modal?: string;
}

export interface NavCreateSection {
  type: SVGType;
  label: string;
  content?: NavCreateItem[];
}

interface FilterNavCreateItemsParams {
  data: NavCreateSection[];
  role: string;
  permissionsCache: Record<string, boolean>;
  permissionMapping: Record<
    string,
    { permission: string; ownerRoles: string[] }
  >;
}

// Filter function for nav create items
export const filterNavCreateItems = ({
  data,
  role,
  permissionsCache,
  permissionMapping,
}: FilterNavCreateItemsParams): NavCreateSection[] => {
  const options = ["management", "tasks", "accounting", "documents"];

  return data
    .filter((item) => options.includes(item.label.toLowerCase()))
    .map((item) => ({
      ...item,
      content: item.content?.filter(({ label }) => {
        const mapping = permissionMapping[label.toLowerCase()];

        // Render item if no permission is defined or if the role is not an owner
        if (!mapping || !mapping.ownerRoles.includes(role)) {
          return true;
        }

        // Only filter out if the role owns the permission and it's false
        return permissionsCache[label.toLowerCase()];
      }),
    }))
    .filter((item) => item.content && item.content.length > 0);
};
