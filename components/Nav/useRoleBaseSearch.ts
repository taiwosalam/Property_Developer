import { useRole } from "@/hooks/roleContext";
import { IGlobalSearchPageData } from "./global_data";

const ROLE_PERMISSIONS = {
  manager: {
    users: true,
    properties: true,
    landlords: true,
    tenants: true,
    units: true,
    agentCommunities: true,
    agentRequests: true,
    propertyApplications: true, // Managers can see applications
    branches: true,
    announcements: true,
    brands: false,
    campaigns: false,
    examines: true,
    enrollments: false,
    undo: false,
  },
  account: {
    users: true,
    properties: true,
    landlords: true,
    tenants: true,
    units: true,
    agentCommunities: false, // Accountants might not need community access
    agentRequests: false,
    propertyApplications: true, // Accountants can see applications
    branches: true,
    announcements: true,
    brands: false,
    campaigns: false,
    examines: true, // Accountants might not handle examines
    enrollments: false,
    undo: false,
  },
  staff: {
    users: false, // Staff might not see all users
    properties: true,
    landlords: true,
    tenants: true,
    units: true,
    agentCommunities: true,
    agentRequests: true,
    propertyApplications: false, // Staff should NOT see applications
    branches: false, // Staff might not see branch management
    announcements: true,
    brands: false, // Staff might not see brand settings
    campaigns: false, // Staff might not see campaigns
    examines: true,
    enrollments: false, // Staff might not see enrollments
  },
  // Add more roles as needed
  director: {
    users: true,
    properties: true,
    landlords: true,
    tenants: true,
    units: true,
    agentCommunities: true,
    agentRequests: true,
    propertyApplications: true,
    branches: true,
    announcements: true,
    brands: true,
    campaigns: true,
    examines: true,
    enrollments: true,
  },
} as const;

type Role = keyof typeof ROLE_PERMISSIONS;
type SearchResultType = keyof (typeof ROLE_PERMISSIONS)[Role];

export const useRoleBasedSearch = () => {
  const { role } = useRole();

  // Check if a specific search result type is allowed for current role
  const isTypeAllowed = (type: SearchResultType): boolean => {
    if (!role || !(role in ROLE_PERMISSIONS)) {
      return false; // Default to false if role is not defined
    }
    return ROLE_PERMISSIONS[role as Role][type];
  };

  // Filter search results based on role permissions
  const filterSearchResults = (
    searchResults: IGlobalSearchPageData | null
  ): IGlobalSearchPageData | null => {
    if (!searchResults || !role) return searchResults;

    const rolePermissions = ROLE_PERMISSIONS[role as Role];
    if (!rolePermissions) return searchResults;

    // Filter results
    const filteredResults = {
      ...searchResults.results,
      users: rolePermissions.users ? searchResults.results.users : [],
      properties: rolePermissions.properties
        ? searchResults.results.properties
        : [],
      landlords: rolePermissions.landlords
        ? searchResults.results.landlords
        : [],
      tenants: rolePermissions.tenants ? searchResults.results.tenants : [],
      units: rolePermissions.units ? searchResults.results.units : [],
      agentCommunities: rolePermissions.agentCommunities
        ? searchResults.results.agentCommunities
        : [],
      agentRequests: rolePermissions.agentRequests
        ? searchResults.results.agentRequests
        : [],
      propertyApplications: rolePermissions.propertyApplications
        ? searchResults.results.propertyApplications
        : [],
      branches: rolePermissions.branches ? searchResults.results.branches : [],
      announcements: rolePermissions.announcements
        ? searchResults.results.announcements
        : [],
      brands: rolePermissions.brands ? searchResults.results.brands : [],
      campaigns: rolePermissions.campaigns
        ? searchResults.results.campaigns
        : [],
      examines: rolePermissions.examines ? searchResults.results.examines : [],
      enrollments: rolePermissions.enrollments
        ? searchResults.results.enrollments
        : [],
    };

    // Filter counts
    const filteredCounts = {
      ...searchResults.counts,
      users: rolePermissions.users ? searchResults.counts.users : 0,
      properties: rolePermissions.properties
        ? searchResults.counts.properties
        : 0,
      landlords: rolePermissions.landlords ? searchResults.counts.landlords : 0,
      tenants: rolePermissions.tenants ? searchResults.counts.tenants : 0,
      units: rolePermissions.units ? searchResults.counts.units : 0,
      agentCommunities: rolePermissions.agentCommunities
        ? searchResults.counts.agentCommunities
        : 0,
      agentRequest: rolePermissions.agentRequests
        ? searchResults.counts.agentRequest
        : 0,
      propertyApplications: rolePermissions.propertyApplications
        ? searchResults.counts.propertyApplications
        : 0,
      branches: rolePermissions.branches ? searchResults.counts.branches : 0,
      announcement: rolePermissions.announcements
        ? searchResults.counts.announcement
        : 0,
      brands: rolePermissions.brands ? searchResults.counts.brands : 0,
      campaigns: rolePermissions.campaigns ? searchResults.counts.campaigns : 0,
      examines: rolePermissions.examines ? searchResults.counts.examines : 0,
      enrollments: rolePermissions.enrollments
        ? searchResults.counts.enrollments
        : 0,
    };

    return {
      ...searchResults,
      results: filteredResults,
      counts: filteredCounts,
    };
  };

  // Get tab count with role-based filtering
  const getRoleBasedTabCount = (
    label: string,
    searchResults: IGlobalSearchPageData | null
  ): number => {
    if (!searchResults || !role) return 0;

    const rolePermissions = ROLE_PERMISSIONS[role as Role];
    if (!rolePermissions) return 0;

    const counts = searchResults.counts;

    switch (label.toLowerCase()) {
      case "management":
        return (
          (rolePermissions.users ? counts.users || 0 : 0) +
          (rolePermissions.properties ? counts.properties || 0 : 0) +
          (rolePermissions.landlords ? counts.landlords || 0 : 0) +
          (rolePermissions.tenants ? counts.tenants || 0 : 0) +
          (rolePermissions.branches ? counts.branches || 0 : 0)
        );
      case "listing":
        return rolePermissions.units ? counts.units || 0 : 0;
      case "community":
        return (
          (rolePermissions.agentCommunities
            ? counts.agentCommunities || 0
            : 0) +
          (rolePermissions.agentRequests ? counts.agentRequest || 0 : 0)
        );
      case "task":
        return (
          (rolePermissions.announcements ? counts.announcement || 0 : 0) +
          (rolePermissions.propertyApplications
            ? counts.propertyApplications || 0
            : 0) +
          (rolePermissions.examines ? counts.examines || 0 : 0)
        );
      case "settings":
        return (
          (rolePermissions.brands ? counts.brands || 0 : 0) +
          (rolePermissions.campaigns ? counts.campaigns || 0 : 0) +
          (rolePermissions.enrollments ? counts.enrollments || 0 : 0)
        );
      default:
        return 0;
    }
  };

  // Get filtered tab results
  const getRoleBasedTabResults = (
    label: string,
    searchResults: IGlobalSearchPageData | null
  ) => {
    if (!searchResults?.results || !role) return [];

    const rolePermissions = ROLE_PERMISSIONS[role as Role];
    if (!rolePermissions) return [];

    const results = searchResults.results;

    switch (label.toLowerCase()) {
      case "management":
        return [
          ...(rolePermissions.users ? results.users : []),
          ...(rolePermissions.properties ? results.properties : []),
          ...(rolePermissions.landlords ? results.landlords : []),
          ...(rolePermissions.tenants ? results.tenants : []),
          ...(rolePermissions.branches ? results.branches : []),
        ];
      case "listing":
        return rolePermissions.units ? [...results.units] : [];
      case "community":
        return [
          ...(rolePermissions.agentCommunities ? results.agentCommunities : []),
          ...(rolePermissions.agentRequests ? results.agentRequests : []),
        ];
      case "task":
        return [
          ...(rolePermissions.announcements ? results.announcements : []),
          ...(rolePermissions.propertyApplications
            ? results.propertyApplications
            : []),
          ...(rolePermissions.examines ? results.examines : []),
        ];
      case "settings":
        return [
          ...(rolePermissions.brands ? results.brands : []),
          ...(rolePermissions.campaigns ? results.campaigns : []),
          ...(rolePermissions.enrollments ? results.enrollments : []),
        ];
      default:
        return [];
    }
  };

  return {
    isTypeAllowed,
    filterSearchResults,
    getRoleBasedTabCount,
    getRoleBasedTabResults,
    rolePermissions: role ? ROLE_PERMISSIONS[role as Role] : null,
  };
};

// Utility function to check permissions outside of React components
export const checkRolePermission = (
  role: string,
  type: SearchResultType
): boolean => {
  if (!(role in ROLE_PERMISSIONS)) return false;
  return ROLE_PERMISSIONS[role as Role][type];
};

// Export role permissions for use in other parts of the app
export { ROLE_PERMISSIONS };
