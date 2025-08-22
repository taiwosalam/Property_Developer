export const ROLE_PERMISSIONS = {
  manager: {
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
    brands: false,
    campaigns: false,
    examines: true,
    enrollments: false,
    undo: false,
    reviews: true,
    messages: true,
    wallet: true,
    settings: true,
    inspection: true,
    subscription: true,
    complaints: true,
    listings: true,
    accounting: true,
    community: true,
    callRequests: true,
  },
  accountant: {
    users: true,
    properties: true,
    landlords: true,
    tenants: true,
    units: true,
    agentCommunities: false,
    agentRequests: false,
    propertyApplications: true,
    branches: true,
    announcements: true,
    brands: false,
    campaigns: false,
    examines: true,
    enrollments: false,
    undo: false,
    reviews: false,
    messages: true,
    wallet: true,
    settings: true,
    inspection: false,
    subscription: false,
    complaints: false,
    listings: true,
    accounting: true,
    community: false,
    callRequests: false,
  },
  staff: {
    users: false,
    properties: true,
    landlords: true,
    tenants: true,
    units: true,
    agentCommunities: true,
    agentRequests: true,
    propertyApplications: false,
    branches: false,
    announcements: true,
    brands: false,
    campaigns: false,
    examines: true,
    enrollments: false,
    undo: false,
    reviews: true,
    messages: true,
    wallet: false,
    settings: false,
    inspection: true,
    subscription: false,
    complaints: true,
    listings: true,
    accounting: false,
    community: true,
    callRequests: true,
  },
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
    undo: true,
    reviews: true,
    messages: true,
    wallet: true,
    settings: true,
    inspection: true,
    subscription: true,
    complaints: true,
    listings: true,
    accounting: true,
    community: true,
    callRequests: true,
  },
} as const;

// Map notification types to permission keys
export const NOTIFICATION_TYPE_TO_PERMISSION: Record<
  string,
  keyof typeof ROLE_PERMISSIONS.manager
> = {
  // User related
  user: "users",
  profile: "users",

  // Property related
  property: "properties",
  "property request": "propertyApplications",
  "new property request": "propertyApplications",
  "property draft": "properties",

  // Communication
  message: "messages",
  review: "reviews",

  // Financial
  invoice: "accounting",
  "wallet transaction": "wallet",

  // Management
  "rent and unit": "units",
  inspection: "inspection",
  examine: "examines",

  // Tasks
  application: "propertyApplications",
  complain: "complaints",
  announcement: "announcements",

  // Community
  "agent community": "agentCommunities",
  "agent request": "agentRequests",
  "new request published": "agentRequests",
  "new post published": "agentCommunities",

  // System
  setting: "settings",
  location: "settings",
  subscription: "subscription",
  listing: "listings",
  trash: "undo",
  "call request": "callRequests",
};

export type UserRole = keyof typeof ROLE_PERMISSIONS;

/**
 * Check if a user role has permission for a specific notification type
 */
export const hasNotificationPermission = (
  role: UserRole,
  notificationType: string
): boolean => {
  // Normalize the notification type
  const normalizedType = notificationType.toLowerCase().trim();

  // Get the permission key for this notification type
  const permissionKey = NOTIFICATION_TYPE_TO_PERMISSION[normalizedType];

  // If no specific permission mapping exists, allow by default
  // You can change this to `false` for stricter control
  if (!permissionKey) {
    console.warn(
      `No permission mapping found for notification type: ${normalizedType}`
    );
    return true;
  }

  // Check if the role has this permission
  return ROLE_PERMISSIONS[role]?.[permissionKey] ?? false;
};

/**
 * Filter notifications based on user role permissions
 */
export const filterNotificationsByRole = <T extends { type: string }>(
  notifications: T[],
  role: UserRole
): T[] => {
  return notifications.filter((notification) =>
    hasNotificationPermission(role, notification.type)
  );
};
